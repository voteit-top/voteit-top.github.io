
var myCarousel = document.querySelector('#myCarousel')
var carousel = new bootstrap.Carousel(myCarousel)	

  const contractOwner = "TCbLNGcJy1SzmoVrZvE1H1oY5mZbuzHhuM";
	let defaultCateId = 0;
	let curItemId = 0;
	let cateNames=['','Country/Region','Person','City','Resort','Brand','Crypto'];
	//let presetranks=JSON.parse(allRanks);
	let maxItemId = presetranks.length-1;
	const PAGESIZE = 55;
  const EVENTCNT = 30;
  var eventStart = 199;
	var voteitModalObj;
	var createModalObj;
	var alleventv = new Vue({
		el: '#allevents_v',
		data:{
      mode:1,
			lastbn:0,
      orderType:['','Buy','Sell'],
      orders:[],
      ordersMap:{},
			events:[],
			eventsMap:new Map(),
			myEvents:[],
			showMine:false,
			waiting:false,
			waitingText:''
		},
		computed:
    {
      sidetitle:function()
      {
        if(this.mode == 2)
          return 'Supporters';
        else if(this.mode == 3)
          return 'Orders';
      }
    },
		methods:
		{
      cancelOrder:function(oid)
      {
        alleventv.pushWaitingEvent("Canel Order...");
        let idx = alleventv.ordersMap[oid];
        alleventv.orders[idx-1].canceling = true;

        dexCancelOrder(tronlinkConnected, oid,function(ret){
                 alleventv.orders[idx-1].canceling = false;
                 alleventv.pushCancelOrder(oid, ret);
                 readBuyPrices();
                 readSellPrices();
                 readUserOrders();
                 if(ret.result)
                 {
                   alleventv.orders.splice(idx-1,1);
                 }
              })
      },
      switchSideTab:function()
			{
				let e = document.getElementById('link_sidetab');
        if(e)
          e.click();
			},
			switchMineTab:function()
			{
				let e = document.getElementById('link_myEvents');
        if(e)
          e.click();
			},
			pushWaitingEvent:function(name)
			{
				this.waiting = true;
				this.waitingText = name + '...waiting Tronlink to sign';
				this.switchMineTab();
        
			},
      pushCancelOrder:function(oid, ret)
      {
        this.waiting =false;
        let evt={};
        evt.name = "Order canceled " + oid;
        evt.error = !ret.result;
        if(ret.result)
        {
          evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/'+ret.retobj;
					evt.details = "check transaction";
        }
        else
        {
          evt.details = ret.retobj;
        }
        this.myEvents.unshift(evt);
				this.switchMineTab(); 
      }
      ,
      pushBuyVoteit:function(amount, ret)
      {
        this.waiting = false;
        let evt = {};
        evt.name = "Buy Voteit "+amount;
				evt.error = !ret.result;
				if(ret.result)
				{
					evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/'+ret.retobj;
					evt.details = "check transaction";
				}
				else
				{
					evt.details = ret.retobj;
				}
				this.myEvents.unshift(evt);
				this.switchMineTab();        
      },
      pushSellVoteit:function(amount, ret)
      {
        this.waiting = false;
        let evt = {};
        evt.name = "Sell Voteit "+amount;
				evt.error = !ret.result;
				if(ret.result)
				{
					evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/'+ret.retobj;
					evt.details = "check transaction";
				}
				else
				{
					evt.details = ret.retobj;
				}
				this.myEvents.unshift(evt);
				this.switchMineTab();        
      },
			pushBuyEvent:function(trxValue, ret)
			{
				this.waiting = false;
				let evt = {};
				evt.name = "Buy "+trxValue;
				evt.error = !ret.result;
				if(ret.result)
				{
					evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/'+ret.retobj;
					evt.details = "check transaction";
				}
				else
				{
					evt.details = ret.retobj;
				}
				this.myEvents.unshift(evt);
				this.switchMineTab();
			},
			pushAirdropEvent:function(ret)
			{
				this.waiting = false;
				let evt = {};
				evt.name = "Airdrop ";
				evt.error = !ret.result;
				if(ret.result)
				{
					evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/'+ret.retobj;
					evt.details = "check transaction";
				}
				else
				{
					evt.details = ret.retobj;
				}
				this.myEvents.unshift(evt);
				this.switchMineTab();
			},
			pushCreateEvent:function(name, ret)
			{
				this.waiting = false;
				let evt = {};
				evt.name = 'Created '+name;
				evt.error = !ret.result;
				if(ret.result)
					{
						evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/'+ret.retobj;
						evt.details = "check transaction";
					}
				else
					{
						evt.details = ret.retobj;
					}
				this.myEvents.unshift(evt);	
				this.switchMineTab();	
			},
			pushClaimEvent:function(ret)
			{
				this.waiting = false;
				let evt = {};
				evt.name = 'ClaimedReward';
				evt.error = !ret.result;
				if(ret.result)
					{
						evt.details = "check transaction";
						evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/'+ret.retobj;
					}
				else
					{
						evt.details = ret.retobj;
					}
				this.myEvents.unshift(evt);
				this.switchMineTab();	
			},
			pushVoteEvent:function(name, amount, ret)
			{
				this.waiting = false;
				let evt = {};
				evt.name = 'Voted '+name;
				evt.param2 = amount;
				evt.error = !ret.result;
				if(ret.result)
					{
						evt.details = "check transaction";
						evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/'+ret.retobj;
					}
				else
					{
						evt.details = ret.retobj;
					}
				this.myEvents.unshift(evt);	
				this.switchMineTab();
			},
			pushUnVoteEvent:function(name, amount, ret)
			{
				this.waiting = false;
				let evt = {};
				evt.name = 'UnVoted ' +name;
				evt.param2 = amount;
				evt.error = !ret.result;
				if(ret.result)
					{
						evt.details = "check transaction";
						evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/'+ret.retobj;
					}
				else
					{
						evt.details = ret.retobj;
					}
				this.myEvents.unshift(evt);
				this.switchMineTab();
			},
			updateEventResult: function(evt)
			{
				if(evt.type == 2) //vote
				{
          evt.name = 'Voted ' + itemName(evt.itemId) + ' ';
					let itemid = evt.itemId;
					let total = evt.total;
          evt.param2 = evt.amount;
					updateItemVote(itemid, total, true);
          this.events.unshift(evt);
					if(this.events.length > EVENTCNT)
            this.events.pop();
				}
				else if(evt.type == 3)//'UnVoted')
				{
          evt.name = "Unvoted " + itemName(evt.itemId) + ' ';
					let itemid = evt.itemId;
					let total = evt.total;
          evt.param2 = evt.amount;
					updateItemVote(itemid, total,false);
          this.events.unshift(evt);
          if(this.events.length > EVENTCNT)
            this.events.pop();
				}
				else if(evt.type == 1)//'Created')
				{
          evt.name = 'Created ';
          evt.param2 = evt.itemId;
					let itemId = Number(evt.itemId);
					let total = evt.total;
					if(presetranks.length <= itemId || presetranks[itemId] == null)
						{
            readItem(itemId);
						}
          this.events.unshift(evt);
          if(this.events.length > EVENTCNT)
            this.events.pop();
				}
				else if(evt.type == 4)
				{
					evt.param2 = evt.amount;
          evt.name = 'RewardClaimed'
          this.events.unshift(evt);
          if(this.events.length > EVENTCNT)
            this.events.pop();
				}
				
			}
		}
		})
  votemodalv.alleventv = alleventv;    
	var createmodalv = new Vue({
		el: '#createModal',
		data: {
		costOfCreate:1000000,
		trxBalance:0,
		itemName:'',
		indicator:'Cost 1TRX to create new item',
		cateId:1,
		cateSelected:1,
		cates:[{id:1,name:'Country/Region'}, {id:2,name:'Person'}, {id:3, name:'City'}, {id:4, name:'Resort'}, {id:5, name:'Brand'},{id:6,name:'Crypto'}]
		},
		methods:
			{
				confirmCreate:function(e)
				{
					tongjiv.creating = true;
					tongjiv.createResult = false;
					//tongjiv.createtext = "wating tronlink to sign";
					alleventv.pushWaitingEvent("Creating");
					contractCreateVoteItem(null, this.cateSelected, this.itemName, this.costOfCreate, function(ret)
											{
												tongjiv.creating = false;
												console.log(ret);
												alleventv.pushCreateEvent(createmodalv.itemName, ret);
												tongjiv.createResult = ret.result;
												if(ret.result)
												{

													tongjiv.createTran = 'https://dappchain.tronscan.io/#/transaction/'+ret.retobj;
													//tongjiv.createtext="New item created";
												}
												else
												{
													tongjiv.createtext = "Error:" + ret.retobj.error;
												}
											});
					createModalObj.hide();
				}	
			}
		});	

	Vue.component('rankitem', {
		  props: ['rank', 'rkitem','rkid','voting', 'unvoting','gsbase','cid'],
		  template: '<div class="row align-items-center" :id="\'p_rank_\'+rkid"><div class="border-bottom col-2 rankh">{{rank}}</div><div class="border-bottom col-4 rankh" :id="\'rank_\'+rkid" :ttitle="rkitem.creator"><a :href="\'#item=\'+rkid">{{rkitem.name}}</a></div><div class="border-bottom col-2 rankh">{{rkitem.votes}}</div><div class="text-center border-bottom col-4 rankh"><div class="btn-group"><button type="button" :itemid="rkid" onclick="voteItem(this)" class="btn btn-sm btn-outline-primary" v-bind:class="{disabled: voting}"><span v-if="voting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Vote</button><button type="button" :itemid="rkid" onclick="unVoteItem(this)" class="btn btn-sm btn-outline-danger" v-bind:class="{disabled: unvoting}">UnVote<span v-if="unvoting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></button></div></div></div>'
		});

	var tongjiv = new Vue({
		  el: '#v_tongji',
		  data: {
			show:true,
		  costOfCreate:1000000,
      totalusers:0,
      totalevents:0,
      exrate:100,
      airdropusers:0,
			totalvotes:0,
			totalrewards:0,
			totalitems:0,
			myvotes:0,
			claiming:false,
			claimResult:false,
			creating:false,
			createtext:'',
			createResult:false,
			claimtext:'',
			claimTran:'',
			createTran:'',
			loading:true,
		  },
    computed:
    {
      estimateReward:function()
      {
        if(this.totalvotes >0)
        {
          return Number(115200/this.totalvotes).toFixed(6);
        }
        else
          return 0;
      }
    },
		methods: {
			tjClaimReward:function(evt)
			{
				tongjiv.claimResult = false;
				//tongjiv.claiming = true;				
				claimReward(function(ret)
				{

					tongjiv.claiming = false;
					tongjiv.claimResult = ret.result;
					alleventv.pushClaimEvent(ret);
					if(ret.result)
					{						
						console.log(ret);
						console.log(ret.retobj);
						tongjiv.claimTran = 'https://dappchain.tronscan.io/#/transaction/'+ret.retobj;
						tongjiv.claimtext = 'claimed successfully';
					}
					else
					{
						console.log(ret);
						console.log(ret.retobj);
						
						tongjiv.claimtext = ret.retobj.error;
					}
				});
			},
			tjCreateNew:function(evt)
			{
				
				createNew();
			},
		  }
		})
		
  function claimReward()
  {
	  tongjiv.tjClaimReward();
  }
  function itemName(itemId)
  {
    if(itemId < presetranks.length && presetranks[itemId])
      return presetranks[itemId].name;
    else
      return String(itemId);
  }
	function  getUrl(id, cid)
	{
		return encodeURI('showitem.html?id=' + key+'&cate='+cid);
	}		
	var rankv = new Vue({
		  el: '#v_ranks',
		  data: {
        show:true,
			  gbase:'showitem.html?id=',
		  	cateId:1,
		  	curPage:1,
		  	pageSize:50,
		  	itemsVoting:new Map(),
		  	allItems:[],
			items:[], //pageitem
			itemsMap: new Map(),
		  },
		computed: {
			hasPrePage: function()
			{
				return this.curPage > 1;
			},
			hasNextPage: function()
			{

				return this.curPage*this.pageSize < this.allItems.length;
			},
			cateName: function()
			{
				return cateNames[this.cateId];
			}

		},
		methods: {
			switchCateId: function(cateId)
			{
				this.cateId = cateId;
				this.allItems.length = 0;
				this.itemsMap.clear();
				this.items.splice(0, this.pageSize);
				this.curPage = 1;
			},
			setCurPage:function()
			{
				this.items.length = 0;
				for(let i=(this.curPage-1)*this.pageSize,j=0;j<this.pageSize&&i<this.allItems.length;i++,j++)
				{
					this.items.push(this.allItems[i]);
				}

			},
			nextPage:function()
			{
				if(!this.hasNextPage)
					return;
				this.items.length = 0;
				for(let i=this.curPage*this.pageSize,j=0;j<this.pageSize&&i<this.allItems.length;i++,j++)
				{
					this.items.push(this.allItems[i]);
				}
				this.curPage ++;
			},
			previousPage:function()
			{
				if(!this.hasPrePage)
					return;

				for(let i=(this.curPage-2)*this.pageSize,j=0;j<this.pageSize&&i<this.allItems.length;i++,j++)
				{
					this.items[j] = this.allItems[i];
				}
				this.curPage --;
			},
			isVoting:function(itemId)
			{
				return this.itemsMap.has(itemId);
			},
			setVoting:function(itemId, flag)
			{
				this.itemsMap.set(itemId, flag);
			}
		  }
		}) 
	var voteitModalv = new Vue(
			{
				el:'#voteitModal',
				data:
				{
					airdroping:false,
					buying:false,
					inputTrxInSun:null,
				},
				methods:
				{
					buyToken:function()
					{
						if(this.inputTrxInSun > 0)
						{
							alleventv.pushWaitingEvent("Buy...");
							this.buying = true;
							contractBuy(null, this.inputTrxInSun,  function(ret){
								voteitModalv.buying = false;
								alleventv.pushBuyEvent(voteitModalv.inputTrxInSun,ret);
								voteitModalObj.hide();
								})
						}
					},
					airDropToken:function()
					{
						alleventv.pushWaitingEvent("Airdrop");
						this.airdroping = true;
						contractAirdrop(null, function(ret){
							voteitModalv.airdroping = false;
							alleventv.pushAirdropEvent(ret);
							voteitModalObj.hide();
							});
					}
				}

			});
	vue_dex = new Vue(
  {
    el:'#voteitdex',
    data:
    {
      show:false,
      buying:false,
      selling:false,
      lastPrice:0,
      totalAmount:0, //deal amount
      totalOrders:0,
      trxBalance:0,
      tokenBalance:0,
      sellAmount:0,
      buyAmount:0,
      buyPrice:0,
      sellPrice:0,
	  ordersMap:{},
	  sordersMap:{},
      sellorders:[{price:null,dprice:'-',amount:null},{price:null,dprice:'-',amount:null},{price:null,dprice:'-',amount:null},{price:null,dprice:'-',amount:null},{price:null,dprice:'-',amount:null}],
      buyorders:[{price:null,dprice:'-',amount:null},{price:null,dprice:'-',amount:null},{price:null,dprice:'-',amount:null},{price:null,dprice:'-',amount:null},{price:null,dprice:'-',amount:null}],
      tradehistories:[],
      indicator:''
    },
    methods:
    {
      buyVoteit:function()
      {
          if(Number(this.buyPrice) < 0.000001)
          {
              this.inidicator = 'minum price is 0.000001';
              return;
          }
          //let trxNeed = this.buyPrice*this.buyAmount;
          if(Number(this.buyPrice)*Number(this.buyAmount) > this.trxBalance)
          {
              this.inidicator = "TRX is not sufficient";
              return;
          }
          this.buying = true;
          alleventv.pushWaitingEvent("Buy Voteit...");
          dexBuyVoteit(tronlinkConnected,Number(this.buyPrice), Number(this.buyAmount), function(ret)
              {
                vue_dex.buying = false;
                alleventv.pushBuyVoteit(vue_dex.buyAmount, ret);
                  console.log(ret);
              }
          )
      },
      sellVoteit:function()
      {
          if(Number(this.sellPrice) < 0.000001)
          {
              this.inidicator = 'minum price is 0.000001';
              return;
              
          }
          //let trxNeed = this.buyPrice*this.buyAmount;
          if(Number(this.sellAmount) > Number(this.tokenBalance))
          {
              this.inidicator = "VOTEIT is not sufficient";
              return;
          }
          this.selling = true;
          alleventv.pushWaitingEvent("Sell Voteit...");
          dexSellVoteit(tronlinkConnected,Number(this.sellPrice), Number(this.sellAmount), function(ret)
              {
                vue_dex.selling = false;
                alleventv.pushSellVoteit(vue_dex.sellAmount, ret);
                  console.log(ret);
              }
          )
      }
    }
  }
  )
var maxOrderId = 0;
setInterval(async ()=>{
    dexRead('getMetrics', function(metrics)
		{
			if(metrics.result)
			{
				let morderId = big2numer(metrics.retobj.totalOrders);
        vue_dex.totalOrders = morderId;
        vue_dex.lastPrice = big2numer(metrics.retobj.lastPrice);
        vue_dex.totalAmount = big2numer(metrics.retobj.totalAmount);
				if(morderId > maxOrderId)
				{
					readBuyPrices();
					readSellPrices();
          readUserOrders();
					maxOrderId = morderId;
				}
			}
		});
    vue_dex.trxBalance = walletv.trxBalance;
    vue_dex.tokenBalance = walletv.tokenBalance;
		},3000);
readBuyPrices();
readSellPrices();
const maxOrders=5;

function readUserOrders()
{
   dexGetOrders(function(ret){
        if(ret.result)
        {
          let ods = ret.retobj;
          let i=0;
          for(;i<ods.length;i++)
          {
              let oid = big2numer(ods[i]);

              dexRead('getOrderDetails',function(odetail){
                if(odetail.result)
                  {
                  let ometrics = odetail.retobj;
                  let torder = {'oid':oid};
                  torder.price = big2numer(ometrics.price); 
                  torder.amount = big2numer(ometrics.amount); 
                  torder.lamount = big2numer(ometrics.leftamout);
                  torder.ts = big2numer(ometrics.ts);
                  torder.tsdone = big2numer(ometrics.tsdone);
                  torder.type = ometrics.otype;
                  if(torder.lamount > 0)
                    {
                      if(!alleventv.ordersMap[oid])
                      {
                        alleventv.orders.unshift(torder);
                        alleventv.ordersMap[oid] = alleventv.orders.length;
                        //alleventv.orders.push(order);
                      }
                      else
                      {
                        alleventv.orders[alleventv.ordersMap[oid]-1] = torder;
                      }
                      
                    }
                    else
                    {
                      let idx = alleventv.ordersMap[oid];
                      if(idx > 0)
                      {
                         alleventv.orders.splice(idx-1,1);
                         alleventv.ordersMap[oid] = 0;
                      }
                    }
                  }
                },oid);
          }
        }
      }
     );
}
function readBuyPrices()
{
  
  dexRead('getBuyPrices',function(bps){
      if(bps.result)
      {
        bps = bps.retobj;
		let i=0;
       for(;i<bps.length;i++)
       {
          let bo =vue_dex.buyorders[i];
          let price = big2numer(bps[i]);
          bo.price = price;
          bo.dprice = bo.price/1000000;
          //bo.amount = 0;//need update;
          vue_dex.ordersMap[price] = bo;
          dexRead('getBuyAmount',function(bas){
            if(bas.result)
            { 
              vue_dex.ordersMap[price].amount = big2numer(bas.retobj);
            }
          }, price);
          
       }
	   for(;i<maxOrders;i++)
	   {
		   vue_dex.buyorders[i].price=null;
		   vue_dex.buyorders[i].dprice='-';
		   vue_dex.buyorders[i].amount=null;
		   
	   }
      }
  })
}

function readSellPrices()
{
  
  dexRead('getSellPrices',function(sps){
    if(!sps.result)
      return;
    sps = sps.retobj;
	let i=0;
     for(;i<sps.length;i++)
     {
        let so =vue_dex.sellorders[maxOrders-i-1];
        so.price = big2numer(sps[i]);
		so.dprice = so.price/1000000;
		let price = so.price;
        so.amount = 0;//need update;
        vue_dex.sordersMap[price]=so;
        dexRead('getSellAmount',function(sa){
          if(sa.result)
           vue_dex.sordersMap[price].amount = big2numer(sa.retobj);
        }, price);
     }
	 for(;i<maxOrders;i++)
	 {
		vue_dex.sellorders[maxOrders-i-1].price=null;
		vue_dex.sellorders[maxOrders-i-1].dprice='-';
		vue_dex.sellorders[maxOrders-i-1].amount=null; 
	 }
  })
}
	function createNew()
	{
		if(!getRealTronweb())
		{
			tronlinkNotConnected();
		}
		else
		{
			createmodalv.trxBalance = walletv.trxBalance;
			createmodalv.costOfCreate = tongjiv.costOfCreate;
			createmodalv.cateSelected = defaultCateId;

			createModalObj = new bootstrap.Modal(document.getElementById('createModal'));
			createModalObj.show();
		}		
	}
	function claimReward(callback)
	{
		if(!getRealTronweb())
		{
			tronlinkNotConnected();
		}
		else
		{
			tongjiv.claiming = true;
			//tongjiv.claimtext="waiting for tronlink to sign";
			alleventv.pushWaitingEvent("Claiming");
			contractClaimReward(null, callback);
		}


	}	
  function readItem(itemId)
  {
      contractRead('getItem', function(ret1){			
      let item ={};
      item.id = itemId;
      item.name = ret1[0];
      item.rank = itemId;
      item.voting = false;
      item.votes = big2numer(ret1[1])/DECIMALS;
      item.cateId = big2numer(ret1[2]);
      item.creator = getLocalTronweb().address.fromHex(ret1[3]);
      let insert = insertIntoRanks(item);
      //console.log(ret1);
      if(insert)
        presetranks[itemId]=item;
      }, itemId,null);
    
  }
	function createRanksOfCate(cateId)
	{
		if(defaultCateId == cateId)
			return;
		let oldCateId = defaultCateId;
		defaultCateId = cateId;
		walletv.cateId = cateId;
		rankv.switchCateId(cateId);

		for(let i=0;i<presetranks.length;i++)
		{
			if(presetranks[i] && presetranks[i].cateId == cateId)
			{
				insertIntoRanks(presetranks[i]);
			}
		}
	
		contractRead('getCateItemsId', function(ret){
				for(let i=0;i<ret.length;i++)
				{
					let itemId = big2numer(ret[i]);
          readItem(itemId);
				}
				//
			}, defaultCateId);
	}
	function readMetrics()
	{
		contractRead('getMetrics', function(ret){
			
			tongjiv.totalvotes = big2numer(ret[0])/DECIMALS;
			 tongjiv.totalrewards = big2numer(ret[1])/DECIMALS;
			 tongjiv.totalitems = big2numer(ret[2])-1;
			 presetranks.length = tongjiv.totalitems+1;			 
			 tongjiv.costOfCreate = big2numer(ret[3]);
			 tongjiv.createtext = "Cost " + tongjiv.costOfCreate/DECIMALS + " TRX to create new item";
			 createmodalv.indicator = tongjiv.createtext;
			 tongjiv.myvotes = big2numer(ret[4])/DECIMALS;
       tongjiv.exrate = big2numer(ret[5]);
       tongjiv.airdropusers = big2numer(ret[6]);
       tongjiv.totalusers = big2numer(ret[7]);
       tongjiv.totalevents = big2numer(ret[8]);
       if(tongjiv.totalevents > eventStart)
       {
         //load event;
         let sidx = eventStart;
         for(;sidx<tongjiv.totalevents;sidx++)
         {
           contractRead('getUpdateEvent', function(ret1){
             
             let evt = {};
             evt.caller = getLocalTronweb().address.fromHex(ret1[0]);
             evt.type = big2numer(ret1[1]);
             evt.itemId = big2numer(ret1[2]);
             evt.amount = big2numer(ret1[3])/DECIMALS;
             evt.total = big2numer(ret1[4])/DECIMALS;
             evt.param2 ='';
             evt.details = evt.caller;
             alleventv.updateEventResult(evt);
           },sidx)
         }
         eventStart = tongjiv.totalevents;
       }
			 tongjiv.loading = false;
		}, null,null,true);
	}
	readMetrics();
	setInterval(async ()=>{
		readMetrics();
    getResource(contractOwner,function(ret){walletv.energyLeft = ret});
		},5000);
  walletv.connectWallet();
	routeByHash();
	
	function voteItemOnLink(itemId)
	{
		console.log("vote item" + itemId);
	}
	function unVoteItemOnLink(itemId)
	{
		console.log("unvote item" + itemId);
	}
	function updateItemVote(itemId, tvotes, up)
	{
		itemId = Number(itemId);
		if(rankv.itemsMap.has(itemId))
		{
			let ov = presetranks[itemId].votes;
      if(up && ov < tvotes)
      {
        presetranks[itemId].votes = tvotes;//update
        if(ov != tvotes)
        {
          rankv.allItems.sort(function(a, b){return b.votes - a.votes});
          rankv.setCurPage();
        }
      }
		}
		else
		{
			if(presetranks[itemId])
				{
				presetranks[itemId].votes = tvotes;
				}
		}
	}
	function insertIntoRanks(item)
	{
		if(item.cateId != rankv.cateId)
			return true;
		if(rankv.itemsMap.has(item.id))
		{
			let ov = presetranks[item.id].votes;
			presetranks[item.id].votes = item.votes;//update
			if(ov != item.votes)
				{
					rankv.allItems.sort(function(a, b){return b.votes - a.votes});
				}
			else
			{
				rankv.setCurPage();
			}
			return false;
		}
		else
		{
			rankv.allItems.push(item);
			rankv.allItems.sort(function(a, b){return b.votes - a.votes});
			rankv.setCurPage();
			rankv.itemsMap.set(item.id, true);
			return true;
		}
	}
	function requestVOTEIT()
	{
		if(!walletv.tlconnected)
		{
			tronlinkNotConnected();
		}
		else
		{
			voteitModalObj = new bootstrap.Modal(document.getElementById('voteitModal'),null);
			voteitModalObj.show();
		}
	}

	function rankFilter() {
	  var input, filter, ul, li, a, i;
	  input = document.getElementById("rankFilterInput");
	  filter = input.value.toUpperCase();
		
	  for (i = 0; i < rankv.items.length; i++) {
		let e = document.getElementById("rank_"+rankv.items[i].id);
		let pdiv = document.getElementById("p_rank_"+rankv.items[i].id);
		txtValue = e.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
		  pdiv.style.display = "";
		} else {
		  pdiv.style.display = "none";
		}
	  }
	}
	function routeByHash()
	{
	  let urltail = window.location.hash;
	  let ic = urltail.indexOf('cate=');
	  if(ic != -1)
	  {
      alleventv.mode = 1;
		  showEle('v_ranks', true);
      showEle('voteitdex',false);
      showEle('v_itemdetail',false);
      
		  vue_itemdetail.show = false;
		  createRanksOfCate(Number(urltail.substr(ic+5)));
	  }
	  else
	  {
		  ic = urltail.indexOf('item=');
		  if(ic != -1)
		  {
			  showItem(Number(urltail.substr(ic+5)));
		  }
		  else
		  {
        ic = urltail.indexOf('dex');
        if(ic != -1)
        {
          showDex();
        }
        else
        {
        alleventv.mode = 1;
        showEle('v_ranks', true);
        showEle('voteitdex',false);
        showEle('v_itemdetail',false);
			  createRanksOfCate(1);
        }
		  }
	  }		
	}
window.onpopstate = function(event) {
	routeByHash();
};
function showDex()
{
  alleventv.mode =3;
  alleventv.switchSideTab();
  showEle('voteitdex',true);
  showEle('v_ranks',false);
  showEle('v_itemdetail',false);
}
function showEle(eleid, show)
{
  var ele = document.getElementById(eleid);
  if(ele)
  {
    if(show)
    {
      ele.classList.remove("vhide");
    }
    else
    {
      ele.classList.add("vhide");
    }
  }
}
function showSupporter(show)
{
	alleventv.showSupport = show;
}
function clickSellItem(e)
{
	let si = Number(e.id);
	vue_dex.buyPrice = vue_dex.sellorders[si].price/1000000;
}
function clickBuyItem(e)
{
	let bi = Number(e.id);
	vue_dex.sellPrice = vue_dex.buyorders[bi].price/1000000;
}

