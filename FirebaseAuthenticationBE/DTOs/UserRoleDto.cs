using FirebaseAuthenticationBE.Enums;
using System.ComponentModel.DataAnnotations;

namespace FirebaseAuthenticationBE.DTOs
{
    public class UserRoleDto
    {
        [Required]
        public UserRole Role { get; set; }
    }
}
