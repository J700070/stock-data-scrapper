import puppeteer from 'puppeteer';


export async function fetchMorningstar(stock) {

    let stockUrl = 'https://financials.morningstar.com/ratios/r.html?t=' + stock;

    let browser = await puppeteer.launch();
    let page = await browser.newPage();


    await page.goto(stockUrl, { waitUntil: 'networkidle2' });

    if (page.url() !== stockUrl) {
        console.log("Este stock no existe en MorningStar");
        return null;
    }

    let data = await page.evaluate(() => {
        // General Info
        let ticker = document.querySelector('div[class="r_title"] > span[class="gry"]').innerText.substring(1);
        let name = document.querySelector('div[class="r_title"] > h1').innerText;

        // Fechas
        let dates = [];

        // MorningStar financials
        let revenue = [];
        let operatingIncome = [];
        let netIncome = [];
        let eps = [];
        let dividends = [];
        let payoutRatio = [];
        let shares = [];
        let bookValue = [];
        let bookValuePerShare = [];
        let operatingCashFlow = [];
        let capSpending = [];
        let freeCashFlow = [];
        let freeCashFlowPerShare = [];
        let workingCapital = [];


        // MorningStar profitability -> Margins % of Sales
        let cogs = [];
        let grossMargin = [];
        let sgAndA = [];
        let rAndD = [];
        let other = [];
        let operatingMargin = [];
        let netIntIncAndOther = [];
        let ebtMargin = [];
        let netMargin = [];

        // MorningStar profitability -> Profitability
        let taxRate = [];
        let assetTurnoverAverage = [];
        let roa = [];
        let financialLeverage = [];
        let roe = [];
        let roic = [];
        let interestCoverage = [];

        // MorningStar growth
        let shareGrowth = [];
        let revenueGrowth = [];
        let operatingIncomeGrowth = [];
        let netIncomeGrowth = [];
        let epsGrowth = [];

        for (let i = 0; i < 11; i++) {
            // Fechas
            let datesCell = 'th[id="YX"]';

            // MorningStar financials
            let revenueCell = 'td[headers="YX i0"]';
            let operatingIncomeCell = 'td[headers="YX i1"]';
            let netIncomeCell = 'td[headers="YX i2"]';
            let epsCell = 'td[headers="YX i3"]';
            let dividendsCell = 'td[headers="YX i4"]';
            let payoutRatioCell = 'td[headers="YX i5"]';
            let sharesCell = 'td[headers="YX i6"]';
            let bookValueCell = 'td[headers="YX i7"]';
            let bookValuePerShareCell = 'td[headers="YX i8"]';
            let operatingCashFlowCell = 'td[headers="YX i9"]';
            let capSpendingCell = 'td[headers="YX i10"]';
            let freeCashFlowCell = 'td[headers="YX i11"]';
            let freeCashFlowPerShareCell = 'td[headers="YX i90"]';
            let workingCapitalCell = 'td[headers="YX i80"]';

            datesCell = datesCell.replace("X", i);
            revenueCell = revenueCell.replace("X", i);
            operatingIncomeCell = operatingIncomeCell.replace("X", i);
            netIncomeCell = netIncomeCell.replace("X", i);
            epsCell = epsCell.replace("X", i);
            dividendsCell = dividendsCell.replace("X", i);
            payoutRatioCell = payoutRatioCell.replace("X", i);
            sharesCell = sharesCell.replace("X", i);
            bookValueCell = bookValueCell.replace("X", i);
            bookValuePerShareCell = bookValuePerShareCell.replace("X", i);
            operatingCashFlowCell = operatingCashFlowCell.replace("X", i);
            capSpendingCell = capSpendingCell.replace("X", i);
            freeCashFlowCell = freeCashFlowCell.replace("X", i);
            freeCashFlowPerShareCell = freeCashFlowPerShareCell.replace("X", i);
            workingCapitalCell = workingCapitalCell.replace("X", i);

            try {
                dates[i] = document.querySelector(datesCell).innerText;
                revenue[i] = document.querySelector(revenueCell).innerText.replace(",", "");
                operatingIncome[i] = document.querySelector(operatingIncomeCell).innerText.replace(",", "");
                netIncome[i] = document.querySelector(netIncomeCell).innerText.replace(",", "");
                eps[i] = document.querySelector(epsCell).innerText.replace(",", "");
                dividends[i] = document.querySelector(dividendsCell).innerText.replace(",", "");
                payoutRatio[i] = document.querySelector(payoutRatioCell).innerText.replace(",", "");
                shares[i] = document.querySelector(sharesCell).innerText.replace(",", "");
                bookValue[i] = document.querySelector(bookValueCell).innerText.replace(",", "");
                bookValuePerShare[i] = document.querySelector(bookValuePerShareCell).innerText.replace(",", "");
                operatingCashFlow[i] = document.querySelector(operatingCashFlowCell).innerText.replace(",", "");
                capSpending[i] = document.querySelector(capSpendingCell).innerText.replace(",", "");
                freeCashFlow[i] = document.querySelector(freeCashFlowCell).innerText.replace(",", "");
                freeCashFlowPerShare[i] = document.querySelector(freeCashFlowPerShareCell).innerText.replace(",", "");
                workingCapital[i] = document.querySelector(workingCapitalCell).innerText.replace(",", "");
            } catch (error) {

                return null
            }


        }

        return {
            name, ticker, dates, revenue, operatingIncome, netIncome, eps, dividends, payoutRatio, shares, bookValue, bookValuePerShare, operatingCashFlow, capSpending, freeCashFlow, freeCashFlowPerShare, workingCapital
        };

    })


    await browser.close();

    return data;
};


export async function fetchStockTickerList() {

    let stockUrl = 'https://stockanalysis.com/stocks/';

    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(stockUrl, { waitUntil: 'networkidle2' });
    await page.select('select[name="perpage"]', '10000');
    let data = await page.evaluate(() => {
        let stockList = [];
        let j = 0;
        for (let i = 0; i < document.querySelectorAll('table > tbody > tr > td').length / 4; i += 4) {
            stockList[j++] = document.querySelectorAll('table > tbody > tr > td')[i].innerText;
        }


        return stockList;
    })


    await browser.close();

    return data;
};