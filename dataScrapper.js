import puppeteer from 'puppeteer';


export async function fetchMorningstar(stock) {

    let stockUrl = 'https://financials.morningstar.com/ratios/r.html?t=' + stock;

    let browser = await puppeteer.launch();
    let page = await browser.newPage();


    await page.goto(stockUrl, { waitUntil: 'networkidle2' });

    let data = await page.evaluate(() => {

        let ticker = document.querySelector('div[class="r_title"] > span[class="gry"]').innerText.substring(1);
        let name = document.querySelector('div[class="r_title"] > h1').innerText;
        let revenue = [];
        let operatingIncome = [];
        let netIncome = [];
        let shares = [];
        let eps = [];
        let fcf = [];
        let fcfPerShare = [];
        let operatingMargin = [];
        let netMargin = [];
        let roe = [];
        let roic = [];
        let shareGrowth = [];
        let revenueGrowth = [];
        let operatingIncomeGrowth = [];
        let netIncomeGrowth = [];
        let epsGrowth = [];

        for (let i = 0; i < 11; i++) {
            let statementRevenue = 'td[headers="YX i0"]';
            let statementOperatingIncome = 'td[headers="YX i2"]';
            let statementNetIncome = 'td[headers="YX i4"]';
            let statementShares = 'td[headers="YX i7"]';
            let statementFcf = 'td[headers="YX i11"]';
            let statementROE = 'td[headers="pr-pro-YX pr-profit i26"]';
            let statementROIC = 'td[headers="pr-pro-YX pr-profit i27"]';

            statementRevenue = statementRevenue.replace("X", i);
            statementOperatingIncome = statementOperatingIncome.replace("X", i);
            statementNetIncome = statementNetIncome.replace("X", i);
            statementShares = statementShares.replace("X", i);
            statementFcf = statementFcf.replace("X", i);
            statementROE = statementROE.replace("X", i);
            statementROIC = statementROIC.replace("X", i);

            revenue[i] = parseFloat(document.querySelector(statementRevenue).innerText.replace(",", ""));
            operatingIncome[i] = parseFloat(document.querySelector(statementOperatingIncome).innerText.replace(",", ""));
            netIncome[i] = parseFloat(document.querySelector(statementNetIncome).innerText.replace(",", ""));
            shares[i] = parseFloat(document.querySelector(statementShares).innerText.replace(",", ""));
            eps[i] = netIncome[i] / shares[i];
            fcf[i] = parseFloat(document.querySelector(statementFcf).innerText.replace(",", ""));
            fcfPerShare[i] = fcf[i] / shares[i];
            operatingMargin[i] = operatingIncome[i] / shares[i];
            netMargin[i] = netIncome[i] / shares[i];
            roe[i] = parseFloat(document.querySelector(statementROE).innerText.replace(",", ""));
            roic[i] = parseFloat(document.querySelector(statementROIC).innerText.replace(",", ""));
            if (i == 0) {
                shareGrowth[i] = 999;
                revenueGrowth[i] = 999;
                operatingIncomeGrowth[i] = 999;
                netIncomeGrowth[i] = 999;
                epsGrowth[i] = 999;
            } else {
                shareGrowth[i] = (shares[i] / shares[i - 1] - 1) * 100;
                revenueGrowth[i] = (revenue[i] / revenue[i - 1] - 1) * 100;
                operatingIncomeGrowth[i] = (operatingIncome[i] / operatingIncome[i - 1] - 1) * 100;
                netIncomeGrowth[i] = (netIncome[i] / netIncome[i - 1] - 1) * 100;
                epsGrowth[i] = (eps[i] / eps[i - 1] - 1) * 100;
            }


        }

        return {
            name, ticker, revenue, operatingIncome, netIncome, shares, eps, fcf, fcfPerShare, operatingMargin, netMargin, roe, roic, shareGrowth, revenueGrowth, operatingIncomeGrowth, netIncomeGrowth, epsGrowth
        };

    })

    console.log(data);

    await browser.close();

    return data;
};


export async function fetchStockTickerList() {

    let stockUrl = 'https://stockanalysis.com/stocks/';

    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto(stockUrl, { waitUntil: 'networkidle2' });

    let data = await page.evaluate(() => {
        let stockList = [];
        let j = 0;
        for (let i = 0; i < document.querySelectorAll('table > tbody > tr > td').length / 4; i += 4) {
            stockList[j++] = document.querySelectorAll('table > tbody > tr > td')[i].innerText;
        }

        return stockList;
    })

    console.log(data);

    await browser.close();

    return data;
};