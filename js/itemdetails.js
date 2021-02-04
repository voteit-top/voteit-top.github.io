let votechange = false;
let pkey1 = ['563492ad6f9170000','000001231cf748a','6141c593931fe','88336','7b'];


let vue_itemdetail = new Vue(
{
  el:'#v_itemdetail',
  data:
  {
   show:false,
   itemId:0,
   searchname:'',
   name:'',
   rank:0,
   vote:0,
   cid:0,
   voting:false,
   unvoting:false,
   vote2rise:0,
   desc:'',
   imgs:[],
   originals:[],
   googleurl:'',
   wikiurl:'',
   voters:[]
  },
  method:
  {
	imgPath:function(img)
	{
	return 
	}
  }
}
)
function getkey()
{
  let pk='';
  for(let i=0;i<pkey1.length;i++)
  {
      pk += (i);
      pk += pkey1[i];
  }
  return pk;
}

 function readItem(itemId)
  {
      contractRead('getItem', function(ret1){		
      
        let item ={};
        item.name = ret1[0];
        item.voting = false;
        item.cateId = big2numer(ret1[2]);
        item.id = itemId;
        item.votes = big2numer(ret1[1])/DECIMALS;
        if(itemId >= presetranks.length)
        {
          presetranks.length = itemId +1;
          presetranks[itemId] = item;
          if(itemId == vue_itemdetail.itemId){
            vue_itemdetail.name = presetranks[itemId].name;
            vue_itemdetail.googleurl = encodeURI('https://www.google.com/search?q='+vue_itemdetail.name);
            vue_itemdetail.wikiurl = encodeURI('https://en.wikipedia.org/wiki/'+vue_itemdetail.name);
            let old = vue_itemdetail.vote;
            vue_itemdetail.vote = presetranks[itemId].votes;
            vue_itemdetail.cid = presetranks[itemId].cateId;
            fetchPhotos();
            if(old != vue_itemdetail.vote)
              {
                refreshRanks();
              }
          }        
        }
        else
        {
          
          presetranks[itemId].votes = item.votes;
          if(itemId == vue_itemdetail.itemId)
            {
            let old = vue_itemdetail.vote;
            vue_itemdetail.vote = item.votes
            if(votechange||old != vue_itemdetail.vote)
              {
                refreshRanks();
                votechange = false;
              }
            }
        }
      }, itemId,null);
    
  }
	function updateItemsByCate(cateId)
	{
		contractRead('getCateItemsId', function(ret){
				for(let i=0;i<ret.length;i++)
				{
					let itemId = big2numer(ret[i]);
          readItem(itemId);
				}
        refreshRanks();
			}, cateId);
	}
  
  function refreshRanks()
  {
    let cateitems=[];
    for(let i=1;i<presetranks.length;i++)
    {
      if(!presetranks[i])
      {
         console.log('undefined presetranks' + i);
      }
      else
      {
        if(presetranks[i].cateId == vue_itemdetail.cid)
        {
          cateitems.push(i);
        }
      }
    }
    cateitems.sort(function(l,r){return presetranks[r].votes - presetranks[l].votes});
    let priorvote =0;
    for(let i=0;i<cateitems.length;i++)
    {
      presetranks[cateitems[i]].rank = i+1;
      
      if(cateitems[i] == vue_itemdetail.itemId)
      {
         vue_itemdetail.rank = i+1;
         if(i > 0)
         {
            vue_itemdetail.vote2rise = (priorvote - vue_itemdetail.vote).toFixed(6);
            if(vue_itemdetail.rank != 1 && vue_itemdetail.vote2rise == 0)
            {
              vue_itemdetail.vote2rise = 0.000001;
            }
         }
         else
         {
            vue_itemdetail.vote2rise=0;
         }
        break
      }
      
      priorvote = presetranks[cateitems[i]].votes;
    }    
  }


function fetchPhotos()
{
  if(vue_itemdetail.imgs.length == 0)
  {
      //fetch from pexels
      
      fetch(encodeURI("https://api.pexels.com/v1/search?query="+vue_itemdetail.name),{
        headers: {
          Authorization: getkey().slice(1)
        }
      })
       .then(resp => {
         return resp.json()
       })
       .then(data => {
         if(data.photos){
           for(let i=0;i<data.photos.length;i++)
           {
              vue_itemdetail.imgs.push(data.photos[i].src.large);
              vue_itemdetail.originals.push(data.photos[i].src.original);
           }
         }
         else
         {
          
         }
       })
    } 
}
function showItem(id)
{
	vue_itemdetail.itemId = id;
	if(id < presetranks.length)
	{				
		vue_itemdetail.name = presetranks[id].name;
		vue_itemdetail.vote = presetranks[id].votes;
		vue_itemdetail.cid = presetranks[id].cateId;
		vue_itemdetail.googleurl = encodeURI('https://www.google.com/search?q='+vue_itemdetail.name);
		vue_itemdetail.wikiurl = encodeURI('https://en.wikipedia.org/wiki/'+vue_itemdetail.name); 
		vue_itemdetail.show = true;
    vue_itemdetail.desc ='';
    vue_itemdetail.imgs = [];
    vue_itemdetail.originals=[];
    
    showEle('v_ranks', false);
    showEle('voteitdex',false);
    showEle('v_itemdetail',true);
    alleventv.mode = 2;
		if(rankItemDetails[id])
		{
			vue_itemdetail.desc = rankItemDetails[id].desc;
			vue_itemdetail.imgs = rankItemDetails[id].imgs.split('|');
		  for(let i=0;i<vue_itemdetail.imgs.length;i++)
		  {
			if(vue_itemdetail.imgs[i].indexOf('http') != 0)
			  {
			  vue_itemdetail.imgs[i] = 'https://cdn.jsdelivr.net/gh/voteit-top/voteitimgs@0.0.1/imgs/' + vue_itemdetail.imgs[i];
			  }
		  }
		}		
		updateItemsByCate(vue_itemdetail.cid);
		refreshRanks()
		fetchPhotos()
	}
}