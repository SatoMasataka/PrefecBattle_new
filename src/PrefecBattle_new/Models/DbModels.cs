using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PrefecBattle_new.Models
{
    /// <summary>
    /// 都道府県データ表示用
    /// </summary>
    public class PrefecData
    {
        public string PrefecCd { get; set; }
        public string PrefecNm { get; set; }
        public string PrefecCopy { get; set; }
        public int AllBattleNum { get; set; }
        public int WinBattleNum { get; set; }
        public decimal WinPercentage
        { get
            {
                if (WinBattleNum != 0 && AllBattleNum != 0)
                    return (decimal)WinBattleNum / AllBattleNum * 100;
                else
                    return 0;
            }
        }
    }

    /// <summary>
    /// バトル結果格納クラス
    /// </summary>
    public class BattleDetail
    {
        /// <summary>
        /// 回戦
        /// </summary>
        public int RoundSeq { get; set; }
        public decimal Value_A { get; set; }
        public decimal Value_B { get; set; }
        public string TokeiCd { get; set; }

        //以下統計項目マスタの内容
        public string TokeiNm { get; set; }
        public string Tani { get; set; }
        public string Year { get; set; }
    }

    /// <summary>
    /// 結果表示用
    /// </summary>
    public class BattleDispResult
    {
        public string Prefec_A_Nm { get; set; }
        public string Prefec_B_Nm { get; set; }
        public List<BattleDetail> BattleDetails { get; set; }

        public  BattleDispResult() { BattleDetails = new List<BattleDetail>(); }

    }
}
