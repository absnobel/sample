using System.Web.Mvc;
using MvcApplication1.Filters;
using System;
using System.IO;
using System.Diagnostics;
namespace MvcApplication1.Controllers
{
    public class HotTowelController : Controller
    {
        //
        // GET: /HotTowel/

        public ActionResult Index()
        {
           if (Request.QueryString["_escaped_fragment_"] == null) {
                return View();
                }
 
                // If the request contains the _escaped_fragment_, then we return an HTML Snapshot tp the bot
                try {
                //We´ll crawl the normal url without _escaped_fragment_
                var result = Crawl(Request.Url.AbsoluteUri.Replace("?_escaped_fragment_=", ""));
                return Content(result);
                }
                catch (Exception ex) {
                // If any exception occurs then you can log the exception and return the normal View()
                //... Wathever method to log ...
                return View();
                }
        }

        /// <summary>
        /// Start a new phantomjs process for crawling
        /// </summary>
        /// <param name="url">The target url</param>
        /// <returns>Html string</returns>
        private string Crawl(string url)
        {
            var appRoot = Path.GetDirectoryName(AppDomain.CurrentDomain.BaseDirectory);

            var startInfo = new ProcessStartInfo
            {
                Arguments = String.Format("{0} {1}", Path.Combine(appRoot, "Scripts\\createSnapshot.js"), url),
                FileName = Path.Combine(appRoot, "phantomjs.exe"),
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                RedirectStandardInput = true,
                StandardOutputEncoding = System.Text.Encoding.UTF8
            };

            var p = new Process();
            p.StartInfo = startInfo;
            p.Start();
            string output = p.StandardOutput.ReadToEnd();
            p.WaitForExit();
            return output;
        }
    }
}
