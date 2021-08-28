import { fetchMorningstar, fetchStockTickerList } from "./dataScrapper.js"
import PG from 'pg'
import fs from 'fs'
import { parseINIString } from './config.js'

//=================================: TODO :===========================================
//  1) Morningstar mezcla monedas -> Solo coger stocks con todo en dólares
//              
//
//====================================================================================

try {
    var data = fs.readFileSync('./database.ini', 'utf8');

    var javascript_ini = parseINIString(data);
    console.log(javascript_ini['postgresql']);

}
catch (e) {
    console.log(e);
}

var pgClient = new PG.Client(javascript_ini['postgresql']);
pgClient.connect();


let stockList = await fetchStockTickerList();
console.log(stockList.length);
for (let i = 0; i < stockList.length; i++) {
    let stock = await fetchMorningstar(stockList[i]);

    if (stock !== null && stock !== undefined) {
        console.log("Stock conseguido: '" + stock.ticker + "'.");

        let qStocks = 'INSERT INTO public.stocks(ticker, name, created_at, last_modified) ' +
            'VALUES (\'' + stock.ticker + '\', \'' + stock.name + '\', current_timestamp, current_timestamp) ' +
            'ON CONFLICT (ticker) DO UPDATE SET name = excluded.name, last_modified = excluded.last_modified; ';

        pgClient.query(qStocks, (err, res) => {
            console.log(err, res);
        });

        for (let j = 0; j < 11; j++) {

            let qFinancials = 'INSERT INTO public.financials("tickerDate", ticker, date, revenue, "operatingIncome", "netIncome", eps, dividends, "payoutRatio", shares, "bookValue", "bookValuePerShare", "operatingCashFlow", "capSpending", "freeCashFlow", "freeCashFlowPerShare", "workingCapital") ' +
                'VALUES (\'' + stock.ticker + ':' + stock.dates[j] + '\', \'' + stock.ticker + '\', \'' + stock.dates[j] + '\', \'' + stock.revenue[j] + '\', \'' + stock.operatingIncome[j] + '\', \'' + stock.netIncome[j] + '\', \'' + stock.eps[j] + '\', \'' + stock.dividends[j] + '\', \'' + stock.payoutRatio[j] + '\', \'' + stock.shares[j] + '\', \'' + stock.bookValue[j] + '\', \'' + stock.bookValuePerShare[j] + '\', \'' + stock.operatingCashFlow[j] + '\', \'' + stock.capSpending[j] + '\', \'' + stock.freeCashFlow[j] + '\',\'' + stock.freeCashFlowPerShare[j] + '\',\'' + stock.workingCapital[j] + '\') ' +
                'ON CONFLICT ("tickerDate") DO UPDATE SET revenue = excluded.revenue, "operatingIncome" = excluded."operatingIncome", "netIncome" = excluded."netIncome", eps = excluded.eps,dividends = excluded.dividends, "payoutRatio" = excluded."payoutRatio", shares = excluded.shares, "bookValue" = excluded."bookValue", "bookValuePerShare" = excluded."bookValuePerShare", "operatingCashFlow" = excluded."operatingCashFlow", "capSpending" = excluded."capSpending", "freeCashFlow" = excluded."freeCashFlow", "freeCashFlowPerShare" = excluded."freeCashFlowPerShare", "workingCapital" = excluded."workingCapital";'



            pgClient.query(qFinancials, (err, res) => {
                console.log(err, res);
            });
        }


    } else {
        console.log("Stock no conseguido");
    }
}

console.log("Finalizado");

