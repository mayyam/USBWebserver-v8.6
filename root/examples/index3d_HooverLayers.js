var layer0 = new ol.layer.Tile({
		      source: new ol.source.BingMaps({
		        // Get your own key at http://bingmapsportal.com/
		        // Replace the key below with your own.
		        key: 'AhaJDO_bWhekq58C0nGLRkwJSMphRFDTYeccozENkqZTAAa1W0OgoaWmcgbPxatZ',
		        imagerySet: 'AerialWithLabels'
		        })
		});	
		
	var layer1 = new ol.layer.Tile({
       opacity: 0.7,
       source: new ol.source.OSM()
      });
	  
	  
	
	 var layer2 = new ol.layer.Vector({
		source : new ol.source.GeoJSON({
		    projection : 'EPSG:3857',
			url : 'data/geojson/earthquake2000.json'
		}),
		style:new ol.style.Style({
		    image: new ol.style.Circle({
			  fill: new ol.style.Fill({
				color: 'rgba(255,255,0,0.5)'
			  }),
			  radius: 5,
			  stroke: new ol.style.Stroke({
				color: '#ff0',
				width: 1
			  })
		  })
	    })
		/*style: new ol.style.Style({
			image: new ol.style.Circle({
			  radius: 3,
			  fill: new ol.style.Fill({color: 'yellow'})
			})
		  })*/
	});
	
	var ol2d = new ol.Map({
		  target: 'map',
		  layers: [layer0, new ol.layer.Group({layers: [layer1,layer2]})
		  ],
		  view: new ol.View({
		      center: ol.proj.transform([102.5883991, 26.2960083], 'EPSG:4326', 'EPSG:3857'),
            zoom: 11
		      /*center: [916604.6871918146, 5919252.373120429],
           zoom: 14 projection : 'EPSG:900913',*/
		  })
		});
		
		
    var ol3d = new olcs.OLCesium(ol2d); // map is the ol.Map instance
    var scene = ol3d.getCesiumScene();
    var terrainProvider = new Cesium.CesiumTerrainProvider({
      url: '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
    });
    scene.terrainProvider = terrainProvider;
    ol3d.setEnabled(ol3d.getEnabled());

    var modelMatrix = Cesium.Transforms.northEastDownToFixedFrame(
        Cesium.Cartesian3.fromDegrees(102.5883991, 26.2960083, 0.0));
    var model = scene.primitives.add(Cesium.Model.fromGltf({
        url: 'data/SampleData/models/Hoover/HooverDamtunnelsdetailedDebug.gltf',
        modelMatrix: modelMatrix,
        scale: 5.0
    }));
	
	var zoom2World = function() {
    ol2d.getView().setCenter([0, 0]);
    ol2d.getView().setZoom(2); 
    };
    var zoom2Yunnan = function() {
    ol2d.getView().setCenter(ol.proj.transform([102.5883991, 26.2960083], 'EPSG:4326', 'EPSG:3857'));
    ol2d.getView().setZoom(11); 
    };
	
    function bindInputs(layerid, layer) {
	  new ol.dom.Input($(layerid + ' .visible')[0])
		  .bindTo('checked', layer, 'visible');
	  $.each(['opacity', 'hue', 'saturation', 'contrast', 'brightness'],
		  function(i, v) {
			new ol.dom.Input($(layerid + ' .' + v)[0])
				.bindTo('value', layer, v)
				.transform(parseFloat, String);
		  }
	  );
	}
	
	ol2d.getLayers().forEach(function(layer, i) {
	  bindInputs('#layer' + i, layer);
	  if (layer instanceof ol.layer.Group) {
		layer.getLayers().forEach(function(sublayer, j) {
		  bindInputs('#layer' + i + j, sublayer);
		});
	  }
	});

	$('#layertree li > span').click(function() {
	  $(this).siblings('fieldset').toggle();
	}).siblings('fieldset').hide();