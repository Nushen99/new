$(document).ready(function(){
    chrome.storage.local.get(['items'], function(obj){
        console.log(obj)
    
        let items = obj.items;
        if(items && items.length > 0) {
            items = JSON.parse(items);
        } else {
            items = [];
        }
        
        items.forEach(function(item, index){
            console.log(index, 'index')
            // $("ul").append('<li>'+'<button type="button" id="btnRemove">X</button>'+item.key+' : '+item.value+'</li>');   
             const $li = $(`<li><button type="button" data-delete-btn="">X</button>${item.key} => ${item.value}</li>`).prependTo('#list'); 
             $li.find('[data-delete-btn]').on('click', function() {
                    const existedItems = items.filter(function(s){
                        return s.key !== item.key;
                    })
                    chrome.storage.local.set({'items': JSON.stringify(existedItems)});
                    this.parentNode.remove();
                    // alert('hi');

                });
        })

    });


    $('#submit').on("click", function(){
        chrome.storage.local.get(['items'], function(obj){
            let items = [];
            items = obj.items;
            if(items && items.length > 0) {
                items = JSON.parse(items);
            } else {
                items = [];
            }

            let currentKey = $('#item').val();
            if(items.some(function(item){
                return item.key===currentKey
            })) {
                alert("Word is already set.")
            } else {
                const newItem = {
                    key: $('#item').val(),
                    value: $('#item1').val()
                };  
                items.push(newItem);
                
                chrome.storage.local.set({'items': JSON.stringify(items)});

                const $li = $(`<li><button type="button" data-delete-btn="">X</button>${newItem.key} => ${newItem.value}</li>`).prependTo('#list');
                $li.find('[data-delete-btn]').on('click', function() {
                    //get all list
                    //filter list
                    console.log(items, newItem)
                    const oldItems = items.filter(function(item){
                        return item.key !== newItem.key;
                    })
                    console.log(oldItems);
                    chrome.storage.local.set({'items': JSON.stringify(oldItems)});
                    console.log(this)
                    this.parentNode.remove();
                    // alert('hi');

                });
            }   

        })  

    });


     $('#clearAll').click(function(){
        
        chrome.storage.local.get(['items'], function(obj){
        let items = obj.items;
        if(items && items.length > 0) {
            items = [];
        } else {
            items = [];
        }
        console.log("deleted")
        chrome.storage.local.set({'items': JSON.stringify(items)});
            $("ul").empty(); // delete li not ul   
        });


    });

     

});






















chrome.storage.onChanged.addListener(function(changes, namespace) {
    
  for (key in changes) {
    var storageChange = changes[key];
    var items = JSON.parse(storageChange.newValue);
    items.forEach(item =>{
       $('body :not(script)').contents()
        .filter(function(){
          return this.nodeType === 3;
        })
        .replaceWith(function(){
          return  this.nodeValue.replace(item.key,item.value);
        }); 
        console.log(changes)
    })

  }
});
 












 {
  "manifest_version": 2,

  "name": "Word Change",
  "description": "Changing words",
  "version": "1.0",
  "icons": {
    "128": "icon128.png",
    "48": "icon48.png",
    "16": "icon16.png"
  },

  "browser_action": {
    "default_icon": "icon16.png",
    "default_title": "<3",
    "default_popup": "popup.html"
  },

  "content_scripts": [
        {
            "js": ["jquery-3.3.1.min.js", "popup.js", "content.js" ],
            "matches": [
                "<all_urls>"
            ],
            "css": ["style.css"],
            "run_at": "document_end"
        }
    ],

    "background": {
        "scripts": ["background.js"]
    },
  "permissions": [
    "storage",
     "debugger"
  ]
}