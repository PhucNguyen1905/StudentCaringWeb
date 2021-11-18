
// Home page 
exports.viewHome = (req, res) => {
    res.render('index', {
        title: 'Home'
    });
}

// Contact start here
exports.viewContact = (req, res) => {
    res.render('contact', {
        title: 'Liên hệ'
    });
}

// Event start here
exports.viewEvent = (req, res) => {
    res.render('event', {
        title: 'Sự kiện'
    })
}

exports.viewMyEvent = (req, res) => {
    res.render('student_event', {
        title: 'Sự kiện của tôi'
    })
}


// Request start here
exports.viewPrint = (req, res) => {
    res.render('print_document', {
        title: 'In giấy tờ'
    });
}