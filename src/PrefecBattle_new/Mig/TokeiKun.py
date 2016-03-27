# -*- coding: sjis -*-
import xlrd
import glob
import sqlite3

def GetDataFromXls(tokeiXlsPath):
    ##Excelフォーマット##
    r_no = 2
    r_title = 3
    r_code = 7
    r_tani = 8
    r_year = 9

    c_prefecCd = 0
    ##################
    
    files = glob.glob(tokeiXlsPath + '\*.xls*') # ワイルドカードが使用可能
    KomokuList = []
    DataList = []
    
    for file in files:
        print file
        book = xlrd.open_workbook(file)       
        sheet_1 = book.sheet_by_index(0)
        
        for col in range(sheet_1.ncols):            
            if not sheet_1.cell(r_no , col).value or sheet_1.cell(r_no , col).value=='*':
                continue

            #統計項目取得
            title = sheet_1.cell(r_title , col).value+sheet_1.cell(r_title+1 , col).value+sheet_1.cell(r_title+2 , col).value
            code = sheet_1.cell(r_code , col).value
            tani = sheet_1.cell(r_tani , col).value
            year = int(sheet_1.cell(r_year , col).value)

            liK = [title,code,tani,year]
            KomokuList.append(liK)

            #県別データ取得
            for row in range(sheet_1.nrows):
                if not sheet_1.cell(row , c_prefecCd).value:
                    continue
                prefecCd = sheet_1.cell(row , c_prefecCd).value
                val = sheet_1.cell(row , col).value
                
                liD = [prefecCd,code,val]
                DataList.append(liD)
                
    return KomokuList,DataList

#都道府県マスタ取得
def GetMasterFromXls(masterXlsPath):
    ##Excelフォーマット##
    c_prefecCd = 0
    c_prefecNm = 1
    c_prefecCp = 2
    ##################

    book = xlrd.open_workbook(masterXlsPath)       
    sheet_1 = book.sheet_by_index(0)
    MasterList = []
        
    for row in range(sheet_1.nrows):
        if(not sheet_1.cell(row,c_prefecCd)):
            continue

        code = sheet_1.cell(row , c_prefecCd).value
        name = sheet_1.cell(row , c_prefecNm).value.replace(' ', '')
        copy = sheet_1.cell(row , c_prefecCp).value
        liM = [code , name , copy]
        MasterList.append(liM)

    return MasterList       
            

def DeleteTable(conn,targetTab):
    cur = conn.execute("SELECT * FROM sqlite_master WHERE type='table' and name='%s'" % targetTab)
    if cur.fetchone() != None:  #存在していたら削除
        conn.execute("DROP TABLE %s" % targetTab)

def MigrateSqlite(komoku,data,master):
    KomokuTabNm = "TokeiKomoku"
    DataTabNm = "TokeiData"
    MasterNm = "PrefecMaster"
    #ButtleHistTabNm = "ButtleHist"
    
    conn = sqlite3.connect('./sqlite.db')
    DeleteTable(conn,KomokuTabNm)
    DeleteTable(conn,DataTabNm)
    DeleteTable(conn,MasterNm)
    #DeleteTable(conn,ButtleHistTabNm)
            
    conn.execute("CREATE TABLE %s(tokeiNm TEXT, tokeiCd TEXT, tani TEXT, year INTEGER)" % KomokuTabNm)
    print "項目テーブル作成"
    conn.execute("CREATE TABLE %s(tokeiCd TEXT, prefecCd TEXT,  value REAL)" % DataTabNm)
    print "都道府県別データテーブル作成"
    conn.execute("CREATE TABLE %s(prefecCd TEXT,  prefecNm TEXT , prefecCp TEXT)" % MasterNm)
    print "都道府県マスタ作成"

    for k in komoku:
        conn.execute("INSERT INTO %s (tokeiNm, tokeiCd,tani,year) VALUES('%s', '%s', '%s', '%s')" % (KomokuTabNm,k[0],k[1],k[2],k[3]))
    for d in data:
        conn.execute("INSERT INTO %s (prefecCd, tokeiCd,value) VALUES('%s', '%s', '%s')" % (DataTabNm,d[0],d[1],d[2]))
    for m in master:
        conn.execute("INSERT INTO %s (prefecCd, prefecNm,prefecCp) VALUES('%s', '%s', '%s')" % (MasterNm,m[0],m[1],m[2]))
        print m[1]
    
    conn.commit()

def PrepareTransactTable():
    conn = sqlite3.connect('./sqlite.db')
    DeleteTable(conn,'BattleHist')
    DeleteTable(conn,'BattleResult')
    DeleteTable(conn,'BattleDetail')
    conn.execute("CREATE TABLE BattleDetail(btlSetCd TEXT, roundSeq INTEGER,tokeiCd TEXT, value_A REAL,value_B REAL)")
    conn.execute("CREATE TABLE BattleResult(btlSetCd TEXT,prefecCd TEXT,resultFlg TEXT)")
    conn.execute("CREATE TABLE BattleHist (btlSetCd TEXT, prefecCd_A TEXT, prefecCd_B TEXT, insertTime TEXT)")
    conn.commit()


def TokeiToDb(tokeiXlsPath):
    komoku,data = GetDataFromXls(tokeiXlsPath)
    master = GetMasterFromXls(tokeiXlsPath + '\master\mas.xls')
    MigrateSqlite(komoku,data,master)


if __name__ == "__main__":
    TokeiToDb("政府統計")
    #PrepareTransactTable()
        

