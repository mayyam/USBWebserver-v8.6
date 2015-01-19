/* global Ext, ol */

/* jshint browser:true, devel:true, indent: 4 */

Ext.require([
    'Ext.container.Viewport',
    'Ext.layout.container.Border',
    'Ext.tree.plugin.TreeViewDragDrop'   
]);
 
var mappanel, tree;
var ol3d;
var map2d;
Ext.application({

    name: 'OL3EXT4',

    launch: function () {

        mappanel = Ext.create('Ext.panel.Panel', {

            title: "Test Map",

            layout: 'fit',
			
			region: "center",

            html: "<div id='test-map'></div>", // The map will be drawn inside

            listeners: {

                afterrender: function () {


 		            var layer0 = new ol.layer.Tile({
						  title: 'BingMaps',
						  source: new ol.source.BingMaps({
							// Get your own key at http://bingmapsportal.com/
							// Replace the key below with your own.
							key: 'AhaJDO_bWhekq58C0nGLRkwJSMphRFDTYeccozENkqZTAAa1W0OgoaWmcgbPxatZ',
							imagerySet: 'AerialWithLabels'
							})
					});	
					var layer1 = new ol.layer.Tile({
					   title: 'OSM',
					   opacity: 0.7,
					   source: new ol.source.OSM()
					  });
					  
	  
	
					var layer2 = new ol.layer.Vector({
						title: 'Earthquakes',
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

                    map2d = new ol.Map({

                        target: 'test-map',

                        renderer: 'canvas',

                        layers: [layer0, new ol.layer.Group({layers: [layer1,layer2]})],

                        view: new ol.View({

                            center: ol.proj.transform([102.5883991, 26.2960083], 'EPSG:4326', 'EPSG:3857'),

                            zoom: 5

                        })

                    });
					
				ol3d = new olcs.OLCesium(map2d ); // map is the ol.Map instance
				var scene = ol3d.getCesiumScene();
				var terrainProvider = new Cesium.CesiumTerrainProvider({
				  url: '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
				});
				scene.terrainProvider = terrainProvider;
				ol3d.setEnabled(true);
				
                console.log("mappanel.map.layers");
				console.log(map2d.getLayers().getArray()[1].Tile);
			
	            
                },

                // The resize handle is necessary to set the map!

                resize: function () {

                    var size = [document.getElementById(this.id + "-body").offsetWidth, document.getElementById(this.id + "-body").offsetHeight];

                 

                    map2d.setSize(size);

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
			
		var store2 = Ext.create('Ext.data.TreeStore', {
            model: 'MyLayerTreeModel',
			root: {
							expanded: true,
							children:  mappanel.layers
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
			store: store2,
			tbar: [{
                text: "remove",
                handler: function() {
                    layer = mappanel.map.layers[1];
					
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

