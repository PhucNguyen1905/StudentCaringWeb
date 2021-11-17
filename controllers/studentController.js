

exports.viewHome = (req, res) => {
    res.render('index', {
        title: 'Home'
    });
}


exports.viewContact = (req, res) => {
    res.render('contact', {
        title: 'Liên hệ'
    });
}

exports.viewPrint = (req, res) => {
    res.render('print_document', {
        title: 'In giấy tờ'
    });
}