namespace Inuplan.Intranet.Core.ViewComponents
{
    using Extensions;
    using Microsoft.AspNetCore.Mvc;
    using System.Security.Claims;
    using System.Security.Principal;
    using System.Threading.Tasks;

    public class MenuViewComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync(WindowsIdentity identity)
        {
            var username = identity.UsernameWithoutDomain();
            return await Task.FromResult(View("Default", username));
        }
    }
}
