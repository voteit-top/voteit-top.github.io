    
    var voteModalObj;
    var vue_dex = null;
    let vue_signdays = null;
  	const  DECIMALS = 1000000;
    var walletv = new Vue({
		  el: '#v_wallet',
		  data: {
		  	cateId:1,
		  	tlconneting:false,
			tlconnected: false,
			ConnectWallet: 'Connect Tronlink',
			wallet:'wallet',
			trxBalance: 0,
			tokenBalance: 0,
      energyLeft:0
		  },
		  methods: {
			connectWallet: function () {
			  if(!walletv.tlconnected)
			  {
				//connect tronlink
				walletv.wallet="Connecting Tronlink"
				walletv.tlconneting = true;
				loginWithTronlink(
					function(tlweb)
					{
					walletv.tlconnected = true;
					walletv.tlconneting = false;
          
          
					readUserOrders();
          let addr = tlweb.defaultAddress.base58
          if(addr){
			vue_signdays.addr = addr;
			vue_signdays.getSignInfo();
            walletv.wallet = (addr.substring(0,5) + "..." + addr.substring(addr.length-5));
            var balobj = setInterval(async ()=>{
              if(!walletv.tlconnected)
                {
                clearInterval(balobj);
                }
              getTrxBalance(tronlinkNotConnected, function(trx, token)
              {
                walletv.trxBalance =  trx/DECIMALS;
                walletv.tokenBalance = token/DECIMALS;
                if(vue_dex)
                {
                   vue_dex.trxBalance = walletv.trxBalance;
                   vue_dex.tokenBalance = walletv.tokenBalance;
                }
                if(getRealTronweb() && getRealTronweb().defaultAddress.base58)
                {
                  let addr = getRealTronweb().defaultAddress.base58
                  walletv.wallet = (addr.substring(0,5) + "..." + addr.substring(addr.length-5));
                }
              });
              },5000);
            }
          else
            {
            walletv.wallet = "Please login tronlink first";
						walletv.tlconneting = false;
						walletv.tlconnected = false;
            }
					}, 
					30000, 
					function(type)
					{					{
						walletv.tlconneting = false;
						walletv.tlconnected = false;
						walletv.wallet="Cannot connect Tronlink"
						
						var myModal = new bootstrap.Modal(document.getElementById('tronlinkModal'),null);
						myModal.show();
					}
					});
				walletv.tlconnected = 1;
			  }
			},
			exitWallet:function()
			{
				logoutTronlink(function()
					{
						walletv.tlconnected = false;
						walletv.wallet = "wallet";
						walletv.trxBalance=0;
						walletv.tokenBalance=0;
					})
			}
		  }
		})
	var votemodalv = new Vue({
		el: '#voteModal',
		data: {
		isVote:'true',
		itemId:0,
		itemName:'',
		inputVotes:0,
		tokenBalance:0,
		indicator:'',
    alleventv:null,
    //1,vote,2:vote done;3:unvote;4:uv done
    callback:null
		},
		computed:
		{
			title:function()
			{
				if(this.isVote)
				{
					return 'Vote';
				}
				else
					return 'UnVote';
			},
			titleBalance:function()
			{
				if(this.isVote)
				{
					return 'VOTEIT balance:';
				}
				else
					return 'Vote balance:';
			}
		},
		methods: {
			reset:function()
			{
				this.inputVotes='';
				this.indicator = '';
				this.tokenBalance = 0;

			},
			confirmVote:function()
			{
				this.indicator="waiting for tronlink  to sign";			
				let itemId = this.itemId;
				if(this.isVote)
				{
          if(this.callback)
          {
            this.callback(1);
          }
				presetranks[itemId].voting = true;
				voteModalObj.hide();
				let votes = Number(this.inputVotes);
        if(this.alleventv)
          this.alleventv.pushWaitingEvent("Voting");
				contractVoteItem(tronlinkNotConnected, 
								this.itemId, 
								this.inputVotes, 
								function(ret){
                  if(votemodalv.alleventv)
                    votemodalv.alleventv.pushVoteEvent(presetranks[itemId].name, votes, ret);
									presetranks[itemId].voting = false;
                  if(votemodalv.callback)
                  {
                    votemodalv.callback(2);
                  }
									console.log(ret);
									if(ret)
									{
										votemodalv.indicator = "Voted successfully";
									}
									else
									{
										votemodalv.indicator = "Failed to vote";
									}
								})
				}
				else
				{
				if(this.inputVotes > this.vote)
				{
					this.indicator="you can only unvote your votes";
					return;
				}
        if(this.callback)
        {
          this.callback(3);
        }
				presetranks[itemId].unvoting = true;
				voteModalObj.hide();
				let unvotes = Number(this.inputVotes);
        if(this.alleventv)
          alleventv.pushWaitingEvent("UnVoting");
				contractUnVoteItem(tronlinkNotConnected, 
								this.itemId, 
								this.inputVotes, 
								function(ret){
									presetranks[itemId].unvoting = false;
                  if(votemodalv.alleventv)
                    alleventv.pushUnVoteEvent(presetranks[itemId].name, unvotes,ret);
									if(votemodalv.callback)
                  {
                    votemodalv.callback(4);
                  }
									if(ret.result)
									{										
										votemodalv.indicator = "UnVoted successfully";
									}
									else
									{
										votemodalv.indicator = "Failed to unvote:"+ret.retobj;
									}
								})					
				}
			}
		}
	})	    
	function tronlinkNotConnected()
	{
		console.log("No Tronlink connected");
		var myModal = new bootstrap.Modal(document.getElementById('connectWalletModal'),null);
		myModal.show();
	}
  function voteItem(e)
	{
		let itemid = Number(e.getAttribute('itemid'));
		
		if(!getRealTronweb())
		{
			tronlinkNotConnected();
		}
		else
		{
			
			votemodalv.reset();
			votemodalv.tokenBalance = walletv.tokenBalance;
			votemodalv.itemId = itemid;
			votemodalv.itemName = presetranks[itemid].name;
			votemodalv.isVote = true;
			voteModalObj = new bootstrap.Modal(document.getElementById('voteModal'));
			voteModalObj.show();
			//showVoteModal();
		}
		
	}
	function unVoteItem(e)
	{
		let itemid = Number(e.getAttribute('itemid'));
		
		if(!getRealTronweb())
		{
			tronlinkNotConnected();
		}
		else
		{
			votemodalv.reset();
			contractRead('getUserVotes', function(ret){						
						votemodalv.tokenBalance = big2numer(ret)/DECIMALS;
						}, getRealTronweb().defaultAddress.base58,itemid, true);
			votemodalv.itemId = itemid;
			votemodalv.itemName = presetranks[itemid].name;
			votemodalv.isVote = false;
			voteModalObj = new bootstrap.Modal(document.getElementById('voteModal'));
			voteModalObj.show();
			//showVoteModal();
		}
		
	}
	const signincontract = 'TTRyew6RFG1WTdjWPRNXq6ciLjvD3VJgRG';
	
		vue_signdays = new Vue({
			el:'#signindays',
			data:
			{
      addr:'',
      total:0,
      contDays:0,
      alleventv:null,
      daysreward:[5,10,15,20,25,30,50,10,15,20,25,30,35,60,100],	   
			},
      methods:
      {
		 claimSignReward:function()
		 {
			 if(alleventv)
			      alleventv.pushWaitingEvent("Signin Rewards");
			 claimSigninReward(function(ret){
				       alleventv.pushClaimEvent(ret);
					if(ret.result)
					{
						vue_signdays.getSignInfo();
					}
				})
		 },
		 getSignInfo:function()
		 {
		  getUserSignInfo(vue_signdays.addr, function(ret1)
			{
			  if(ret1.result)
			  {
				vue_signdays.contDays = big2numer(ret1.retobj.contDays);
			  }
			});			 
		 }
      }
	});
		
	async function signinUser(addr, callback){
		try{
			let contract = await localTronweb.contract().at(signincontract);
			let ret = await contract.userSignin(addr).send({
													feeLimit:100_000_000,
													callValue:0,
													tokenId:0,
													tokenValue:0,
												  shouldPollResponse:false});
			console.log(ret);
			if(callback)
			{
			callback({result:true, retobj:ret});
			}
		}catch(error)
		{
			if(callback)
			{
				callback({result:false, retobj:error});
			}			
		}		
	}
	async function claimSigninReward(callback){
			if(!tronlinkWeb)
			{
				tronlinkNotConnected();
			}
			else
			{
			try{
				let contract = await tronlinkWeb.contract().at(signincontract);
				let ret = await contract.claimSigninReward().send({
														feeLimit:100_000_000,
														callValue:0,
														tokenId:0,
														tokenValue:0,
													  shouldPollResponse:false});
				console.log(ret);
				if(callback)
				{
				callback({result:true, retobj:ret});
				}
			}
			catch(error)
			{
				if(callback)
				{
					callback({result:false, retobj:error});
				}
			}
		}
	}
	async function getUserSignInfo(addr, callback){
		try{
		let contract = await localTronweb.contract().at(signincontract);
		let ret = await contract.getUserInfo(addr).call({
												feeLimit:100_000_000,
												callValue:0,
												tokenId:0,
												tokenValue:0,
											  shouldPollResponse:false});
		
			if(callback)
			{
			callback({result:true, retobj:ret});
			}	
		}
		catch(error)
		{
			if(callback)
			{
				callback({result:false, retobj:error});
			}
		}
	}	  
	function getParameter(param)
	{
		var query = window.location.search;
		var iLen = param.length;
		var iStart = query.indexOf(param);
		if (iStart == -1)
			return "";
		iStart += iLen + 1;
		var iEnd = query.indexOf("&", iStart);
		if (iEnd == -1)
			return query.substring(iStart);
		return query.substring(iStart, iEnd);
	}  
