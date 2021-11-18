

exports.viewHome = (req, res) => {
    res.render('staff/staff_index', {
        title: 'Home'
    })
}

// This is for Thông báo function
exports.viewNotification = (req, res) => {
    res.render('staff/list_notification', {
        title: 'Danh sách thông báo'
    })
}
exports.viewAddNotification = (req, res) => {
    res.render('staff/add_notification', {
        title: 'Thêm thông báo mới'
    })
}

// This is for Sự kiện function
exports.viewEvet = (req, res) => {
    res.render('staff/list_event', {
        title: 'Danh sách sự kiện'
    })
}
exports.viewAddEvent = (req, res) => {
    res.render('staff/add_event', {
        title: 'Thêm sự kiện mới'
    })
}
