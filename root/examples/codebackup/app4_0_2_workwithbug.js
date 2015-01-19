/* global Ext, ol */

/* jshint browser:true, devel:true, indent: 4 */

Ext.require([
    'Ext.container.Viewport',
    'Ext.layout.container.Border',
    'Ext.tree.plugin.TreeViewDragDrop'   
]);
 
var mappanel, tree;
var ol3d;
var map2d,store;
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
					   title: 'OpenStreetMap',
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

                        //layers: [layer0, new ol.layer.Group({layers: [layer1,layer2]})],
						layers: [layer0,layer1,layer2],

                        view: new ol.View({

                            center: ol.proj.transform([102.5883991, 26.2960083], 'EPSG:4326', 'EPSG:3857'),

                            zoom: 5

                        })

                    });
					
					
					store = Ext.create('Ext.data.TreeStore', {
						root: {
							text: 'Root',
							expanded: true,
							children: [
								{
									text: map2d.getLayers().getArray()[0].get('title'),
									
									leaf: true
								},
								{
									text: map2d.getLayers().getArray()[1].get('title'),
									leaf: true
								},
								{
									text: map2d.getLayers().getArray()[2].get('title'),
									leaf: true
								}
							]
						}
						});
					console.log("store");
					console.log(store);
						

				
		
				console.log("exttree");
				console.log(map2d.getLayers().getArray()[0].get('title'))
				ol3d = new olcs.OLCesium(map2d ); // map is the ol.Map instance
				var scene = ol3d.getCesiumScene();
				var terrainProvider = new Cesium.CesiumTerrainProvider({
				  url: '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
				});
				scene.terrainProvider = terrainProvider;
				ol3d.setEnabled(false);
				
                console.log("mappanel.map.layers");
				console.log(map2d.getLayers().getArray().length);
				var layers = map2d.getLayers();
			    for(i = 0, n = layers.getLength();  i < n; i++) {
				  console.log("n");
				  console.log(i);
				  var layer = layers.getArray()[i];
				/*   if (layer.get('name') == 'layer1') {
					layer1 = layer;
					break;
				  } */
				    console.log(layer.get('title'));
				 }
	            
                },

                // The resize handle is necessary to set the map!

                resize: function () {

                    var size = [document.getElementById(this.id + "-body").offsetWidth, document.getElementById(this.id + "-body").offsetHeight];

                 

                    map2d.setSize(size);

                }



            }

        });
		

		

			
		var store2 = Ext.create('Ext.data.TreeStore', {
            model: 'MyLayerTreeModel',
			root: {
							expanded: true,
							children:  mappanel.layers
				}
        });
		
		var store3 = Ext.create('Ext.data.TreeStore', {
            model: 'MyLayerTreeModel',
            root: {
				
				text: 'Data',
				expanded: true,
				children: [
					{
						
						text: 'BaseLayers',
						expanded: true,
						children: [
							{
								text: 'BingMaps',
						        leaf: true,
						        checked: true
							}
						]
						
					},
					{
						text: 'OverlayLayers',
						expanded: true,
						children: [
							{
								text: 'OpenStreetMap',
								leaf: true,
								checked: true,
							
							},
							{
								text: 'Earthquakes',
								leaf: true,
								checked: true
							}
						]
					}
				]
			}
        });
			
		tree = Ext.create('Ext.tree.Panel', {
			            rootVisible: false,
						title: 'Catalog',
						width: 300,
						height: 250,
						border: true,
						region: "west",
						collapsible: true,
						collapseMode: "mini",
						autoScroll: true,
						lines: false,
						useArrows:true,
						
						store: store3,
						tbar: [
						/* {
							text: "remove",
							handler: function() {														
								map2d.removeLayer(map2d.getLayers().getArray()[2]);
							}
						}, {
							text: "add",
							handler: function() {
								map2d.addLayer(layer);
							}
						}, */
						{
							text: "3D",
							border:true,
							handler: function() {
								ol3d.setEnabled(!ol3d.getEnabled());
							}
						}],
						listeners: {
							  itemclick: function(c, record) {
								// get layer id from clicked row record
								var layerId = record.get('text');
                                //console.log(layerId);
								// find layer node in tree by layer id
								//var node = tree.getStore().getNodeById(layerId);
								// set node checked attribute to true
								//node.set('checked', true);
								var layers = map2d.getLayers();
								for(i = 0, n = layers.getLength();  i < n; i++) {
								  console.log("nlayers");
								  console.log(i);
								  var layer = layers.getArray()[i];
								   if (layer.get('title') == layerId) {
									console.log(layer.get('title'));
									layer.setVisible(!layer.getVisible())
									break;
								    } 
									
								 }
								
								
							}
						}

					});	

		Ext.create('Ext.container.Viewport', {

            layout: 'border',
            hideBorders: true,
            items: [
                
                mappanel,tree

            ]

        });
		
/* 		Ext.create('Ext.container.Viewport', {
    layout: 'border',
    renderTo: Ext.getBody(),
    items: [{
        region: 'north',
        html: '<h1 class="x-panel-header">Page Title</h1>',
        autoHeight: true,
        border: false,
        margins: '0 0 5 0'
    }, {
        region: 'west',
        collapsible: true,
        title: 'Navigation',
        width: 150
        // could use a TreePanel or AccordionLayout for navigational items
    }, {
        region: 'south',
        title: 'South Panel',
        collapsible: true,
        html: 'Information goes here',
        split: true,
        height: 100,
        minHeight: 100
    }, {
        region: 'east',
        title: 'East Panel',
        collapsible: true,
        split: true,
        width: 150
    }, {
        region: 'center',
        xtype: 'tabpanel', // TabPanel itself has no title
        activeTab: 0,      // First tab active by default
        items: {
            title: 'Default Tab',
            html: 'The first tab\'s content. Others may be added dynamically'
        }
    }]
}); */

    }

});

