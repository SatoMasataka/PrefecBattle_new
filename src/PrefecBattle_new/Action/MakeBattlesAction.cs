using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data.SQLite;
using PrefecBattle_new.Models;
using System.Web;


namespace PrefecBattle_new.Action
{
    public class BattlesDbAction
    {

        private string PrefecA { get; set; }
        private string PrefecB { get; set; }
        private int MutchNum { get; set; }

        private string SQLITE_PATH { get{ return Startup.Configuration["AppPath:SqlitePath"] ; } }

        #region 公開メソッド
        /// <summary>
        /// 全都道府県データ
        /// </summary>
        /// <returns></returns>
        public List<PrefecData> GetAllPrefecs()
        {
            List<PrefecData> retList = new List<PrefecData>();
            using (var conn = new SQLiteConnection("Data Source=" + SQLITE_PATH))
            {
                //指定数分ランダムに統計と値を取得
                conn.Open();
                SQLiteCommand command = conn.CreateCommand();
                command.CommandText = "SELECT pm.prefecNm AS prefecNm, pm.prefecCp AS prefecCp, pm.prefecCd AS prefecCd, " +
                                      "   (SELECT count(*) FROM BattleResult br1 WHERE br1.prefecCd = pm.prefecCd) AS allBattleNum, " +
                                      "   (SELECT count(*) FROM BattleResult br2 WHERE br2.prefecCd = pm.prefecCd AND resultFlg= '1') AS winBattleNum " +
                                      "FROM PrefecMaster pm ";
                using (SQLiteDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        PrefecData pd = new PrefecData();
                        pd.PrefecCd = Convert.ToString(reader["prefecCd"].ToString());
                        pd.PrefecCopy = Convert.ToString(reader["prefecCp"].ToString());
                        pd.PrefecNm = Convert.ToString(reader["prefecNm"].ToString());
                        pd.AllBattleNum = Convert.ToInt32(reader["allBattleNum"].ToString());
                        pd.WinBattleNum = Convert.ToInt32(reader["winBattleNum"].ToString());

                        retList.Add(pd);
                    }
                }
            }
            return retList;
        }

        /// <summary>
        /// バトル生成メインクラス
        /// </summary>
        /// <param name="mutchNum"></param>
        /// <returns>バトルコード</returns>
        public string LetsBattle(string _prefecA, string _prefecB, int _mutchNum = 5)
        {
            PrefecA = _prefecA;
            PrefecB = _prefecB;
            MutchNum = _mutchNum;

            if (!CheckBeforeBattle())
                throw new Exception("入力チェックエラー");

            string btlSetCd = Guid.NewGuid().ToString();
            List<BattleDetail> res = GetButtle();
            RegisterButtle(res, btlSetCd);

            return btlSetCd;
        }

        /// <summary>
        /// バトル取得メインクラス
        /// </summary>
        /// <param name="btlSetCd"></param>
        /// <returns></returns>
        public BattleDispResult GetBattle(string btlSetCd)
        {
            BattleDispResult retVal = new BattleDispResult();

            string aNm, bNm;
            GetBattlePrefecNm(btlSetCd, out aNm, out bNm);
            retVal.Prefec_A_Nm = aNm;
            retVal.Prefec_B_Nm = bNm;

            retVal.BattleDetails = GetBattleDetails(btlSetCd);
            return retVal;
        }
        #endregion

        /// <summary>
        /// バトル対象の都道府県名取得
        /// </summary>
        /// <param name="btlSetCd"></param>
        /// <param name="prefecNm_A"></param>
        /// <param name="prefecNm_B"></param>
        private void GetBattlePrefecNm(string btlSetCd ,out string prefecNm_A, out string prefecNm_B)
        {
            prefecNm_A = "";
            prefecNm_B = "";
            using (var conn = new SQLiteConnection("Data Source=" + SQLITE_PATH))
            {
                //指定数分ランダムに統計と値を取得
                conn.Open();
                SQLiteCommand command = conn.CreateCommand();
                command.CommandText = "SELECT a.prefecNm AS aNm, a.prefecCp, b.prefecNm AS bNm, b.prefecCp " +
                                      "FROM BattleHist his " +
                                      "INNER JOIN PrefecMaster a " +
                                      "   ON his.prefecCd_A = a.prefecCd " +
                                      "INNER JOIN PrefecMaster b " +
                                      "   ON his.prefecCd_B = b.prefecCd " +
                                      "WHERE his.btlSetCd = @btlSetCd";
                command.Parameters.Add("btlSetCd", System.Data.DbType.String).Value = btlSetCd;
                using (SQLiteDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        prefecNm_A = Convert.ToString(reader["aNm"].ToString());
                        prefecNm_B = Convert.ToString(reader["bNm"].ToString());
                    }
                }
            }
        }

        /// <summary>
        /// バトル詳細の取得
        /// </summary>
        /// <param name="btlSetCd"></param>
        /// <returns></returns>
        private List<BattleDetail> GetBattleDetails(string btlSetCd)
        {
            List<BattleDetail> retVal = new List<BattleDetail>();
            using (var conn = new SQLiteConnection("Data Source=" + SQLITE_PATH))
            {
                //指定数分ランダムに統計と値を取得
                conn.Open();
                SQLiteCommand command = conn.CreateCommand();
                command.CommandText = "SELECT tk.tokeiNm AS tokeiNm, tk.year AS year, tk.tani As tani, bd.roundSeq AS roundSeq, bd.value_A AS value_A, bd.value_B AS value_B " +
                                  "FROM TokeiKomoku tk " +
                                  "INNER JOIN BattleDetail bd " +
                                  "   ON bd.tokeiCd = tk.tokeiCd  " +
                                  "WHERE bd.btlSetCd = @btlSetCd " +
                                  "ORDER BY bd.roundSeq";
                // パラメータのセット
                command.Parameters.Add("btlSetCd", System.Data.DbType.String).Value = btlSetCd;

                using (SQLiteDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        BattleDetail bd = new BattleDetail();
                        bd.Value_A = Convert.ToDecimal(reader["value_A"].ToString());
                        bd.Value_B = Convert.ToDecimal(reader["value_B"].ToString());
                        bd.TokeiNm = Convert.ToString(reader["tokeiNm"].ToString());
                        bd.Year = Convert.ToString(reader["year"].ToString());
                        bd.Tani = Convert.ToString(reader["tani"].ToString());
                        bd.RoundSeq = Convert.ToInt16(reader["roundSeq"].ToString());
                        retVal.Add(bd);
                    }
                }
                conn.Close();
            }
            return retVal;
        }

        /// <summary>
        /// 生成前の入力チェック
        /// </summary>
        /// <returns></returns>
        private bool CheckBeforeBattle() {

            if (PrefecA == PrefecB)
                return false;

            //都道府県コード存在チェック
            using (var conn = new SQLiteConnection("Data Source=" + SQLITE_PATH))
            {
                conn.Open();
                SQLiteCommand command = conn.CreateCommand();
                command.CommandText = "SELECT 'Z' " +
                                      "FROM PrefecMaster " +
                                      "WHERE prefecCd in (@prefecCdA,@prefecCdB)";
                command.Parameters.Add("prefecCdA", System.Data.DbType.String).Value = PrefecA;
                command.Parameters.Add("prefecCdB", System.Data.DbType.String).Value = PrefecB;
                using (SQLiteDataReader reader = command.ExecuteReader())
                {
                    int count = 0;
                    while (reader.Read())
                    {
                        count++;
                    }
                    if(count !=2)
                        return false;
                }
            }

            return true; }

        /// <summary>
        /// バトル生成メソッド
        /// </summary>
        /// <param name="mutchNum"></param>
        /// <returns></returns>
        private List<BattleDetail> GetButtle()
        {   
            List<BattleDetail> retVal = new List<BattleDetail>();

            using (var conn = new SQLiteConnection("Data Source=" + SQLITE_PATH))
            {
                //指定数分ランダムに統計と値を取得
                conn.Open();
                SQLiteCommand command = conn.CreateCommand();
                
                command.CommandText = "SELECT tk.tokeiCd AS tokeiCd, tdA.value AS value_A, tdB.value AS value_B " +
                                        "FROM TokeiKomoku tk " +
                                        "INNER JOIN TokeiData tdA" +
                                        "   ON tdA.prefecCd = @prefecA " +
                                        "   AND tdA.tokeiCd = tk.tokeiCd " +
                                        "INNER JOIN TokeiData tdB " +
                                        "   ON tdB.prefecCd = @prefecB" +
                                        "   AND tdB.tokeiCd = tk.tokeiCd " +
                                        "ORDER BY RANDOM() LIMIT @mutchNum" ;
                // パラメータのセット
                command.Parameters.Add("prefecA", System.Data.DbType.String).Value = PrefecA;
                command.Parameters.Add("prefecB", System.Data.DbType.String).Value = PrefecB;
                command.Parameters.Add("mutchNum", System.Data.DbType.Int64).Value = MutchNum;

                using (SQLiteDataReader reader = command.ExecuteReader())
                {
                    int roundSeq = 1;
                    while (reader.Read())
                    {
                        BattleDetail bd = new BattleDetail();
                        bd.TokeiCd = reader["tokeiCd"].ToString();
                        bd.RoundSeq = roundSeq;
                        bd.Value_A = Convert.ToDecimal(reader["value_A"].ToString());
                        bd.Value_B = Convert.ToDecimal(reader["value_B"].ToString());
                        retVal.Add(bd);

                        roundSeq++;
                    }
                }                
                conn.Close();
            }
            return retVal;
        }

        /// <summary>
        /// バトルの登録
        /// </summary>
        /// <param name="resultList"></param>
        private void RegisterButtle(List<BattleDetail> resultList, string btlSetCd)
        {
            if (resultList.Count != MutchNum)
                throw new Exception("回戦数不一致エラー");

            string resFlgA, resFlgB;
            GetResultFlg(resultList, out resFlgA, out resFlgB);

            using (var conn = new SQLiteConnection("Data Source=" + SQLITE_PATH))
            {
                conn.Open();
                using (SQLiteTransaction trans = conn.BeginTransaction())
                {
                    SQLiteCommand command = conn.CreateCommand();

                    /////////////////////////////////
                    //バトル履歴テーブルへの格納
                    /////////////////////////////////
                    command.CommandText = "INSERT INTO BattleHist (btlSetCd , prefecCd_A , prefecCd_B, insertTime) " +
                                         "VALUES (@btlSetCd, @prefecCd_A , @prefecCd_B, @insertTime)";

                    command.Parameters.Add("btlSetCd", System.Data.DbType.String).Value = btlSetCd;
                    command.Parameters.Add("prefecCd_A", System.Data.DbType.String).Value = PrefecA;
                    command.Parameters.Add("prefecCd_B", System.Data.DbType.String).Value = PrefecB;
                    command.Parameters.Add("insertTime", System.Data.DbType.String).Value = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss");
                    command.ExecuteNonQuery();

                    /////////////////////////////////
                    //バトル詳細テーブルへの格納
                    /////////////////////////////////
                    command.CommandText = "INSERT INTO BattleDetail(btlSetCd, roundSeq, tokeiCd, value_A, value_B) " +
                                          "VALUES (@btlSetCd, @roundSeq, @tokeiCd,  @value_A, @value_B)";
                    // パラメータのセット
                    command.Parameters.Add("roundSeq", System.Data.DbType.Int16);
                    command.Parameters.Add("tokeiCd", System.Data.DbType.String);
                   
                    command.Parameters.Add("value_A", System.Data.DbType.Decimal);
                    command.Parameters.Add("value_B", System.Data.DbType.Decimal);

                    int roundSeq = 1;
                    foreach(BattleDetail br in resultList)
                    {
                        command.Parameters["btlSetCd"].Value = btlSetCd;
                        command.Parameters["roundSeq"].Value = roundSeq;
                        command.Parameters["tokeiCd"].Value = br.TokeiCd;
                        
                        command.Parameters["value_A"].Value = br.Value_A;
                        command.Parameters["value_B"].Value = br.Value_B;
                        command.ExecuteNonQuery();
                        roundSeq++;
                    }

                    /////////////////////////////////
                    //バトル結果テーブルへの格納
                    /////////////////////////////////
                    command.CommandText = "INSERT INTO BattleResult(btlSetCd, prefecCd, resultFlg) " +
                                          "VALUES (@btlSetCd, @prefecCd, @resultFlg)";
                    command.Parameters.Add("prefecCd", System.Data.DbType.String);
                    command.Parameters.Add("resultFlg", System.Data.DbType.String);

                    command.Parameters["btlSetCd"].Value = btlSetCd;
                    command.Parameters["prefecCd"].Value = PrefecA;
                    command.Parameters["resultFlg"].Value = resFlgA;
                    command.ExecuteNonQuery();
                    command.Parameters["prefecCd"].Value = PrefecB;
                    command.Parameters["resultFlg"].Value = resFlgB;
                    command.ExecuteNonQuery();

                    trans.Commit();
                }
            }
        }

        /// <summary>
        /// バトル結果フラグ生成
        /// </summary>
        /// <param name="resultList"></param>
        /// <param name="resFlgA"></param>
        /// <param name="resFlgB"></param>
        private void GetResultFlg(List<BattleDetail> resultList, out string resFlgA, out string resFlgB)
        {
            int a_win = (from r in resultList
                         where r.Value_A > r.Value_B
                         select "").ToList().Count;
            int b_win = (from r in resultList
                         where r.Value_A < r.Value_B
                         select "").ToList().Count;

            if (a_win > b_win)  //A勝ち
            { resFlgA = "1"; resFlgB = "0";}
            else if (a_win < b_win)  //B勝ち
            { resFlgA = "0"; resFlgB = "1";}
            else  //引き分け
            { resFlgA = "2"; resFlgB = "2"; }
        }

    }


   
}
