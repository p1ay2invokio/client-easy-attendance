const maekhan = {
    status: 200,
    data: [
        {
            Barcode: "830222103",
            SecondaryBarcode: "0003619",
            Name: "เข่งดำ เบอร์ 1 SRP",
            RetailPrice: 160,
            Qty: 19
        },
        {
            Barcode: "830222203",
            SecondaryBarcode: "0002767",
            Name: "เข่งดำ เบอร์ 2 SRP",
            RetailPrice: 145,
            Qty: 23
        },
        {
            Barcode: "830222204",
            SecondaryBarcode: "0002767",
            Name: "เข่งดำ เบอร์ 3 SRP",
            RetailPrice: 145,
            Qty: 23
        },
    ]
};

const sanpatong = {
    status: 200,
    data: [
        {
            Barcode: "830222103",
            SecondaryBarcode: "0003619",
            Name: "เข่งดำ เบอร์ 1 SRP",
            RetailPrice: 160,
            Qty: 10
        },
        {
            Barcode: "830222203",
            SecondaryBarcode: "0002767",
            Name: "เข่งดำ เบอร์ 2 SRP",
            RetailPrice: 145,
            Qty: 17
        },
        {
            Barcode: "830222206",
            SecondaryBarcode: "0002767",
            Name: "เข่งดำ เบอร์ 5 SRP",
            RetailPrice: 145,
            Qty: 23
        },
    ]
};

const doilor = {
    status: 200,
    data: [
        {
            Barcode: "830222103",
            SecondaryBarcode: "0003619",
            Name: "เข่งดำ เบอร์ 1 SRP",
            RetailPrice: 160,
            Qty: 2
        },
        {
            Barcode: "830222203",
            SecondaryBarcode: "0002767",
            Name: "เข่งดำ เบอร์ 2 SRP",
            RetailPrice: 145,
            Qty: 8
        },
    ]
};

let allbarcode = new Set([...maekhan.data.map(i=> i.Barcode), ...sanpatong.data.map(i=>i.Barcode), ...doilor.data.map(i=>i.Barcode)])

const result = Array.from(allbarcode).map(barcode=>{
    const m = maekhan.data.find(i=> i.Barcode == barcode)
    const s = sanpatong.data.find(i=> i.Barcode == barcode)
    const d = doilor.data.find(i=> i.Barcode==barcode)

    return {
        Barcode: m ? m?.Barcode : s ? s.Barcode : d ? d.Barcode : 'not found',
        maekhan: m ? m?.Qty : 0,
        sanpatong: s ? s?.Qty : 0,
        doilor: d ? d.Qty : 0
    }
})


console.log(result)