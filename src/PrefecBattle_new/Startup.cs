using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.Runtime;

namespace PrefecBattle_new
{
    /// <summary>
    /// コンフィグファイル値保持
    /// </summary>
    public static class ConfigValues
    {
        public static string SqlitePath { get; set; }
    }


        public class Startup
        {
            public static IConfiguration Configuration { get; set; }

            public Startup(IHostingEnvironment env, IApplicationEnvironment appEnv)
            {
                var path = appEnv.ApplicationBasePath;
                Configuration = new ConfigurationBuilder().AddJsonFile($"{path}/appsettings.json").AddEnvironmentVariables().Build();
            }

            // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
            public void ConfigureServices(IServiceCollection services)
            {
                services.AddMvc();

            }

            public void Configure(IApplicationBuilder app)
            {
                app.UseMvc();
            }
        }
    
}
