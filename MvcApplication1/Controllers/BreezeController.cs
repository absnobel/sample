using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.WebApi2;

using Breeze.ContextProvider.EF6;
using Newtonsoft.Json.Linq;

using Newtonsoft.Json;
using MvcApplication1.Models;
using Breeze.ContextProvider;

namespace  MvcApplication1
{
    [BreezeController]
    public class BreezeController : ApiController
    {
        readonly EFContextProvider<UsersContext> _contextProvider =
         new EFContextProvider<UsersContext>();
       
        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            
            return _contextProvider.SaveChanges(saveBundle);
        }
    }
}
