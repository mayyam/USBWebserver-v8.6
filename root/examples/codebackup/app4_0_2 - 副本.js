/* global Ext, ol */

/* jshint browser:true, devel:true, indent: 4 */

Ext.require([
    'Ext.container.Viewport',
    'Ext.layout.container.Border',
    'Ext.tree.plugin.TreeViewDragDrop'   
]);
 
var mappanel, tree;
var ol3d;
Ext.application({

    name: 'OL3EXT4',

    launch: function () {

        var mappanel = Ext.create('Ext.panel.Panel', {

            title: "Test Map",

            layout: 'fit',
			
			region: "center",

            html: "<div id='test-map'></div>", // The map will be drawn inside

            listeners: {

                afterrender: function () {


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

                    this.map = new ol.Map({

                        target: 'test-map',

                        renderer: 'canvas',

                        layers: [layer0, new ol.layer.Group({layers: [layer1,layer2]})],

                        view: new ol.View({

                            center: ol.proj.transform([102.5883991, 26.2960083], 'EPSG:4326', 'EPSG:3857'),

                            zoom: 5

                        })

                    });
					
				ol3d = new olcs.OLCesium(this.map ); // map is the ol.Map instance
				var scene = ol3d.getCesiumScene();
				var terrainProvider = new Cesium.CesiumTerrainProvider({
				  url: '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
				});
				scene.terrainProvider = terrainProvider;
				ol3d.setEnabled(true);

                },

                // The resize handle is necessary to set the map!

                resize: function () {

                    var size = [document.getElementById(this.id + "-body").offsetWidth, document.getElementById(this.id + "-body").offsetHeight];

                    console.log(size);

                    this.map.setSize(size);

                }
				


            }

        });
        var store = Ext.create('Ext.data.TreeStore', {
            model: 'MyLayerTreeModel',
            root: {
				text: 'Root',
				expanded: true,
				children: [
					{
						text: 'Child 1',
						leaf: true
					},
					{
						text: 'Child 2',
						leaf: true
					},
					{
						text: 'Child 3',
						expanded: true,
						children: [
							{
								text: 'Grandchild',
								leaf: true
							}
						]
					}
				]
			}
        });
			
		
		tree = Ext.create('Ext.tree.Panel', {
			
			title: 'Simple Tree',
			width: 300,
			height: 250,
			border: true,
			region: "west",
			collapsible: true,
            collapseMode: "mini",
            autoScroll: true,
			lines: false,
			store: store,
			tbar: [{
                text: "remove",
                handler: function() {
                    layer = mappanel.map.layers[1];
					console.log(mappanel.map.layers[1])
                    mappanel.map.removeLayer(layer);
                }
            }, {
                text: "add",
                handler: function() {
                    mappanel.map.addLayer(layer);
                }
            },{
                text: "3D",
                handler: function() {
                    ol3d.setEnabled(ol3d.getEnabled());
                }
            }]

		});
		
		Ext.create('Ext.container.Viewport', {

            layout: 'border',
            hideBorders: true,
            items: [
                
                mappanel,tree

            ]

        });

    }

});

