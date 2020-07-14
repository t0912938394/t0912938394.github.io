var express = require("express");
const session = require('express-session');
var app = express();
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'somesecret',
    cookie: { maxAge: 160000 }
}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.listen(3000);
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var http = require('http').createServer(app);
var pg = require('pg');
var config = {
    user: 'postgres',
    database: 'DOAN',
    password: '123123as',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
}
var pool = new pg.Pool(config);


app.use('/public', express.static('public'));

app.get("/hodan/list", function(req, res) {
    pool.connect((err, client, release) => {
        if (req.session.username) {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }
            client.query('SELECT * FROM ho_dan_point ORDER BY id_hodan ASC', (err, result) => {
                release()
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                //console.log(req.session.username);
                res.render("hodan_list.ejs", { danhsach: result });

            });
        } else {
            res.redirect('/login');
        }

    });
});

app.get("/hodan/them", function(req, res) {
    //show form
    if (req.session.username) {
        res.render("hodan_insert.ejs");
    } else {
        res.redirect('/login');
    }


});

app.post("/hodan/them", urlencodedParser, function(req, res) {
    //insert db
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        var hoten = req.body.txtHoten;
        var diachi = req.body.txtDiachi;
        var tinhtrang = req.body.txtTinhtrang;
        var ngaydk = req.body.txtNgaydk;
        var tdx = req.body.txtX;
        var tdy = req.body.txtY;
        var idkhupho = req.body.txtKhupho;
        client.query("insert into ho_dan_point (chuho,diachi,tinhtrang,ngaydangky,geom,id_khupho) values ('" + hoten + "','" + diachi + "','" + tinhtrang + "','" + ngaydk + "','SRID=4326;POINT(" + tdx + " " + tdy + ")','" + idkhupho + "')", (err, result) => {
            release()
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            // console.log(result.rows[0].ten_chu_ho);
            res.redirect("../hodan/list");
        });
    });


});
app.get("/hodan/sua/:id_hodan", function(req, res) {
    pool.connect((err, client, release) => {
        if (req.session.username) {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }
            var id_hodan = req.params.id_hodan;
            client.query("SELECT * FROM ho_dan_point WHERE id_hodan='" + id_hodan + "'", (err, result) => {
                release()
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                //console.log(result.rows[0]);
                res.render("hodan_edit.ejs", { hd: result.rows[0] });
            });
        } else {
            res.redirect('/login');
        }


    });
});

app.post("/hodan/sua", urlencodedParser, function(req, res) {
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        var id = req.body.txtID;
        var hoten = req.body.txtHoten;
        var diachi = req.body.txtDiachi;
        var tinhtrang = req.body.txtTinhtrang;
        var ngaydk = req.body.txtNgaydk;
        var geom = req.body.txtGeom;
        var khu = req.body.txtKhu;
        var tdx = req.body.txtX;
        var tdy = req.body.txtY;
        client.query("UPDATE ho_dan_point SET chuho='" + hoten + "', diachi='" + diachi + "', tinhtrang='" + tinhtrang + "',ngaydangky='" + ngaydk + "',geom='" + geom + "',id_khupho='" + khu + "' WHERE id_hodan='" + id + "'  ", (err, result) => {
            release()
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            // console.log(result.rows[0].ten_chu_ho);
            res.redirect("../hodan/list");
        });
    });

})

app.get("/hodan/xoa/:id_hodan", function(req, res) {
    pool.connect((err, client, release) => {
        if (req.session.username) {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }
            var id_hodan = req.params.id_hodan;
            client.query("DELETE FROM ho_dan_point WHERE id_hodan='" + id_hodan + "' ", (err, result) => {
                release()
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                // console.log(result.rows[0].ten_chu_ho);
                res.redirect("../../hodan/list");
            });
        } else {
            res.redirect('/login');
        }


    });
})

app.get("/nhankhau", function(req, res) {
    pool.connect((err, client, release) => {
        if (req.session.username) {
            if (req.session.username) {
                if (err) {
                    return console.error('Error acquiring client', err.stack)
                }
                client.query('SELECT * FROM nhan_khau ORDER BY id_nhankhau ASC', (err, result) => {
                    release()
                    if (err) {
                        res.end();
                        return console.error('Error executing query', err.stack)
                    }
                    // console.log(result.rows[0].ten_chu_ho);
                    res.render("nhankhau_list.ejs", { danhsach: result });

                });
            } else {
                res.redirect('/login');
            }
        } else {
            res.redirect('/login');
        }


    });
});

app.get("/nhankhau/them", function(req, res) {
    //show form
    if (req.session.username) {
        res.render("nhankhau_insert.ejs");
    } else {
        res.redirect('/login');
    }


});

app.post("/nhankhau/them", urlencodedParser, function(req, res) {
    //insert db
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        var hoten = req.body.txtHoten;
        var gioitinh = req.body.txtGioitinh;
        var ngaysinh = req.body.txtNgaysinh;
        var nghenghiep = req.body.txtNghenghiep;
        var qhch = req.body.txtQuanhech;
        var idhodan = req.body.txtIdhodan;
        var tinhtrang = req.body.txtTinhtrang;
        client.query("insert into nhan_khau (ten,gioitinh,ngaysinh,nghenghiep,quanhe_ch,id_hodan,tinhtrang) values ('" + hoten + "','" + gioitinh + "','" + ngaysinh + "','" + nghenghiep + "','" + qhch + "','" + idhodan + "','" + tinhtrang + "')", (err, result) => {
            release()
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            // console.log(result.rows[0].ten_chu_ho);
            res.redirect("../nhankhau");
        });
    });


});


app.get("/hodan/thongke", function(req, res) {
    pool.connect((err, client, release) => {
        if (req.session.username) {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }
            client.query("select vk.ten_khu,sum(case when nk.tinhtrang=N'Da di' then 1 else 0 end) as nvqs_dadi,sum(case when nk.tinhtrang=N'Chua di' then 1 else 0 end) as nvqs_chuadi,sum(case when nk.tinhtrang=N'Da tiem' then 1 else 0 end) as tiemchung_datiem,sum(case when nk.tinhtrang=N'Chua tiem' then 1 else 0 end) as tiemchung_chuatiem from ho_dan_point hd join nhan_khau nk on  nk.id_hodan = hd.id_hodan join vung_khu_region vk on vk.id_khupho = hd.id_khupho group by vk.ten_khu ORDER BY vk.ten_khu ASC", (err, result) => {
                release()
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                // console.log(result.rows[0].ten_chu_ho);
                res.render("thongke.ejs", { danhsach: result });

            });
        } else {
            res.redirect('/login');
        }


    });
});

app.get("/hodan/thongketuoi", function(req, res) {
    pool.connect((err, client, release) => {
        if (req.session.username) {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }
            client.query("select *,extract(year from age(current_date,ngaysinh))::int as age from nhan_khau where extract(year from age(current_date,ngaysinh))::int >18 and extract(year from age(current_date,ngaysinh))::int <27 and gioitinh=N'Nam'", (err, result) => {
                release()
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                // console.log(result.rows[0].ten_chu_ho);
                res.render("thongketuoi.ejs", { danhsach: result });

            });
        } else {
            res.redirect('/login');
        }


    });
});


app.get("/hodan/thongketiemchung", function(req, res) {
    pool.connect((err, client, release) => {
        if (req.session.username) {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }
            client.query("select *,age(now(),ngaysinh) as age from nhan_khau where extract(year from age(current_date,ngaysinh))::int >=0 and extract(year from age(current_date,ngaysinh))::int <=1", (err, result) => {
                release()
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                // console.log(result.rows[0].ten_chu_ho);
                res.render("thongketiemchung.ejs", { danhsach: result });

            });
        } else {
            res.redirect('/login');
        }


    });
});


app.get("/login", function(req, res) {
    res.sendFile('login.html', { root: __dirname });
});

app.post("/login", urlencodedParser, function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        if (username == 'admin') {
            client.query("SELECT * FROM taikhoan WHERE  username='" + username + "' AND password='" + password + "' LIMIT 1", function(err, result) {
                release()
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                if (result.rows.length > 0) {
                    var sessData = req.session;
                    sessData.username = username;
                    res.redirect("/hodan/list");

                } else {
                    res.redirect("/login");
                }
            });
        } else {
            client.query('SELECT * FROM ho_dan_point WHERE tendangnhap=$1 AND matkhau=$2  LIMIT 1', [username, password], function(err, result) {
                release()
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                if (result.rows.length > 0) {
                    if (result.rows[0].duyet === "Đã duyệt") {
                        var sessData = req.session;
                        sessData.id_hodan = result.rows[0].id_hodan;
                        res.redirect("/");
                    } else {

                        res.redirect("/login");
                    }
                } else {
                    res.redirect("/login");
                }

            });
        }



    });
});


app.get("/dangky", function(req, res) {
    res.render("dangkyhd.ejs");
})

app.post("/dangky", urlencodedParser, function(req, res) {
    //insert db
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        var hoten = req.body.txtHoten;
        var diachi = req.body.txtDiachi;
        var tinhtrang = req.body.txtTinhtrang;
        var ngaydk = req.body.txtNgaydk;
        var tdx = req.body.txtX;
        var tdy = req.body.txtY;
        var idkhupho = req.body.txtKhupho;
        var tendangnhap = req.body.txtUser;
        var password = req.body.txtPass;
        client.query("insert into ho_dan_point (chuho,diachi,tinhtrang,ngaydangky,geom,id_khupho,tendangnhap,matkhau,duyet) values ('" + hoten + "','" + diachi + "','" + tinhtrang + "','" + ngaydk + "','SRID=4326;POINT(" + tdx + " " + tdy + ")','" + idkhupho + "','" + tendangnhap + "','" + password + "',N'Chưa duyệt')", (err, result) => {
            release()
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            // console.log(result.rows[0].ten_chu_ho);
            res.redirect("../hodan/list");
        });
    });


});

app.get("/dangky/nhankhau", function(req, res) {
    if (req.session.id_hodan) {
        res.render("dangkynhankhau.ejs");
    } else {
        res.redirect('/login');
    }


})

app.post("/dangky/nhankhau", urlencodedParser, function(req, res) {
    //insert db
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        var hoten = req.body.txtHoten;
        var gioitinh = req.body.txtGioitinh;
        var ngaysinh = req.body.txtNgaysinh;
        var nghenghiep = req.body.txtNghenghiep;
        var qhch = req.body.txtQuanhech;
        var idhodan = req.session.id_hodan;
        var tinhtrang = req.body.txtTinhtrang;
        client.query("insert into nhan_khau (ten,gioitinh,ngaysinh,nghenghiep,quanhe_ch,id_hodan,tinhtrang) values ('" + hoten + "','" + gioitinh + "','" + ngaysinh + "','" + nghenghiep + "','" + qhch + "','" + idhodan + "','" + tinhtrang + "')", (err, result) => {
            release()
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            // console.log(result.rows[0].ten_chu_ho);
            res.redirect("../nhankhau");
        });
    });


});






app.get("/hodan/duyet/:id_hodan", function(req, res) {
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack)
        }
        var id_hodan = req.params.id_hodan;
        client.query("UPDATE ho_dan_point set duyet=N'Đã duyệt' WHERE id_hodan='" + id_hodan + "'", (err, result) => {
            release()
            if (err) {
                res.end();
                return console.error('Error executing query', err.stack)
            }
            //console.log(result.rows[0]);
            res.redirect("../../hodan/list");
        });
    });
});






app.get("/hodan/chitiet/:id_hodan", function(req, res) {
    pool.connect((err, client, release) => {
        if (req.session.username) {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }
            var id_hodan = req.params.id_hodan;
            //client.query("select * from nhan_khau nk join ho_dan_point hd on nk.id_hodan = hd.id_hodan where nk.id_hodan ='" + id_hodan + "' ", (err, result) => {
            client.query("select * from ho_dan_point hd join nhan_khau nk on nk.id_hodan = hd.id_hodan where nk.id_hodan ='" + id_hodan + "' ", (err, result) => {
                release()
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                // console.log(result.rows[0].ten_chu_ho);
                res.render("nhankhauchitiet.ejs", { danhsach: result });

            });
        } else {
            res.redirect('/login');
        }


    });
})







app.get("/nhankhau/danhsach", function(req, res) {
    pool.connect((err, client, release) => {
        if (req.session.id_hodan) {
            if (err) {
                return console.error('Error acquiring client', err.stack)
            }
            var id_hodan = req.session.id_hodan;
            client.query("select * from ho_dan_point hd  join nhan_khau nk on nk.id_hodan = hd.id_hodan where nk.id_hodan ='" + id_hodan + "' ", (err, result) => {
                release()
                if (err) {
                    res.end();
                    return console.error('Error executing query', err.stack)
                }
                // console.log(result.rows[0].ten_chu_ho);
                res.render("danhsachnhankhau.ejs", { danhsach: result });

            });
        } else {
            res.redirect('/login');
        }


    });
})










app.get("/logout", function(req, res) {
    //show form
    req.session.destroy();
    res.redirect("/");
});

app.get("/", function(req, res) {
    //console.log(req.session.id_hodan);
    res.render("main");
})