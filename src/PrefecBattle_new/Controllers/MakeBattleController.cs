using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using PrefecBattle_new.Action;
using PrefecBattle_new.Models;

namespace PrefecBattle_new.Controllers
{
    [Route("PrefecBattle/[controller]")]
    public class MakeBattleController : Controller
    {
        // GET: api/values
        [HttpGet]
        public List<PrefecData> Get()
        {
           // try {
                BattlesDbAction mba = new BattlesDbAction();
                return mba.GetAllPrefecs();
            //}
            //catch(Exception e)
            //{
            //    System.IO.StreamWriter sw = new System.IO.StreamWriter(
            //        @"C:\test\1.txt",
            //        false,
            //        System.Text.Encoding.GetEncoding("shift_jis"));
            //    //TextBox1.Textの内容を書き込む
            //    sw.Write(e.Message);
            //    //閉じる
            //    sw.Close();
            //    return null;
            //}
            
        }

        // GET api/values/5
        [HttpGet("{btlSetCd}")]
        public BattleDispResult Get(string btlSetCd)
        {
            BattlesDbAction mba = new BattlesDbAction();

            return mba.GetBattle(btlSetCd);
        }

        // POST api/values
        [HttpPost]
        public Simplestring Post([FromBody]BattleRequest value)
        {
            //throw new Exception();
            BattlesDbAction mba = new BattlesDbAction();
            string pA = value.prefecA.PadLeft(2,'0');
            string pB = value.prefecB.PadLeft(2, '0');
            return new Simplestring { val = mba.LetsBattle(pA, pB) };
 
        }



        public class BattleRequest
        {
            public string prefecA { get; set; }
            public string prefecB { get; set; }
        }

        public class Simplestring
        {
            public string val { get; set; }
        }

        // PUT api/values/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody]string value)
        //{
        //}
        //
        //
        //
        //
        //// DELETE api/values/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
