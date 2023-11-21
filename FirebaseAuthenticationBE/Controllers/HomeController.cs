using FirebaseAdmin.Auth;
using FirebaseAuthenticationBE.DTOs;
using FirebaseAuthenticationBE.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FirebaseAuthenticationBE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        [Authorize(Policy = "customer")]
        [Route("[action]")]
        [HttpGet]
        public ActionResult<TestDto> GetAll()
        {
            var course = new TestDto
            {
                id = 1,
                name = "Firebase",
                description =
                            "It supports authentication using passwords, phone numbers, popular federated identity providers " +
                            "like Google, Facebook and Twitter, and more. Firebase Authentication integrates tightly with other " +
                            "Firebase services, and it leverages industry standards like OAuth 2.0 and OpenID Connect, so it can be " +
                            "easily integrated with your custom backend.\r\n\r\nWhen you upgrade to Firebase Authentication with " +
                            "Identity Platform, you unlock additional features, such as multi-factor authentication, blocking " +
                            "functions, user activity and audit logging, SAML and generic OpenID Connect support, multi-tenancy, " +
                            "and enterprise-level support."
            };

            return Ok(course);
        }

        [Authorize]
        [Route("[action]")]
        [HttpPost]
        public async Task<IActionResult> SetUserClaim(UserRoleDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            try
            {
                var headers = HttpContext.Request.Headers;

                if (!headers.ContainsKey("Authorization"))
                {
                    return BadRequest();
                }

                string tokenWithBearer = headers["Authorization"].FirstOrDefault()!;
                string token = tokenWithBearer.Replace("Bearer ", "");
                var fireBasetoken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);
                var uid = fireBasetoken.Uid;

                Dictionary<string, object> claims = new Dictionary<string, object>();

                switch (request.Role)
                {
                    case UserRole.Customer:
                        claims.Add("role", "Customer");
                        break;
                    case UserRole.BackofficeManager:
                        claims.Add("role", "BackofficeManager");
                        break;
                    default:
                        return BadRequest();
                }

                await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(uid, claims);

                return Ok();
            }
            catch
            {
                return StatusCode(500);
            }
        }

    }
}