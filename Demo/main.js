window.onload = init;

function init() {

    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    /**
     * Create an overlay to anchor the popup to the map.
     */
    var overlay = new ol.Overlay( /** @type {olx.OverlayOptions} */ ({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));
    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    var center1 = [11871819.171012152, 1229646.7537582985]
    var map = new ol.Map({
        view: new ol.View({
            center: center1,
            zoom: 11,
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        overlays: [overlay],
        target: 'map',
        view: new ol.View({
            center: [11871819.171012152, 1229646.7537582985],
            zoom: 13
        })
    });


    var vung_phuong = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            url: 'http://localhost:8080/geoserver/DOAN/wms',
            params: { 'LAYERS': 'DOAN:vungranhgioiphuongtxtdm_region' },
            serverType: 'geoserver'
        })
    });
    var vung_khu = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            url: 'http://localhost:8080/geoserver/DOAN/wms',
            params: { 'LAYERS': 'DOAN:vung_khu_region' },
            serverType: 'geoserver'
        })
    });
    var ho_dan = new ol.layer.Image({
        source: new ol.source.ImageWMS({
            url: 'http://localhost:8080/geoserver/DOAN/wms',
            params: { 'LAYERS': 'DOAN:ho_dan_point' },
            serverType: 'geoserver'
        })
    });
    map.addLayer(vung_phuong);
    map.addLayer(vung_khu);
    map.addLayer(ho_dan);

    vung_phuong.setOpacity(0.3);
    vung_khu.setOpacity(0.3);
    ho_dan.setOpacity(0.3);

    map.on('singleclick', function(evt) {

        var view = map.getView();
        var viewResolution = view.getResolution();
        var source = ho_dan.getSource();
        var url = source.getFeatureInfoUrl(
            evt.coordinate, viewResolution, view.getProjection(), {
                'INFO_FORMAT': 'application/json',
                'FEATURE_COUNT': 50
            });

        if (url) {
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function(n) {
                    var content = "<table>";
                    for (var i = 0; i < n.features.length; i++) {
                        var feature = n.features[i];
                        var featureAttr = feature.properties;
                        content += "<tr><td>Tên chủ hộ:" + featureAttr["ten_chu_ho"] +
                            "</td><td>Địa chỉ:" + featureAttr["dia_chi"] +
                            "</td><td>Tình trạng:" + featureAttr["tinhtrang"] +
                            "</td><td>Thành viên:" + featureAttr["thanh_vien"] +
                            "</td><td>Ngày đăng ký:" + featureAttr["ngaydk"] +

                            "</td></tr>"
                    }
                    content += "</table>";
                    $("#popup-content").html(content);
                    overlay.setPosition(evt.coordinate);
                }
            });
        }

    });



    map.on('click', function(evt) {
        console.log(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'));
    });



    $("#chk_vungtdm").change(function() {
        if ($("#chk_vungtdm").is(":checked")) {
            vung_phuong.setVisible(true);
        } else {
            vung_phuong.setVisible(false);
        }
    });

    $("#chk_khupho").change(function() {
        if ($("#chk_khupho").is(":checked")) {
            vung_khu.setVisible(true);
        } else {
            vung_khu.setVisible(false);
        }
    });
    $("#chk_hodan").change(function() {
        if ($("#chk_hodan").is(":checked")) {
            ho_dan.setVisible(true);
        } else {
            ho_dan.setVisible(false);
        }
    });
    $("#chk_ubnd").change(function() {
        if ($("#chk_ubnd").is(":checked")) {
            ubnd.setVisible(true);
        } else {
            ubnd.setVisible(false);
        }
    });

};