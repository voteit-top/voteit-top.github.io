	let localTronweb=null;
	let tronlinkWeb = null;
	let contractTokenId = '1003606';
	const minercontract = 'TECu9sH4r5BZ373yBgBDsS3chC4s24cePA';
	const HttpProvider = TronWeb.providers.HttpProvider;
	const trongridurl = 'https://sun.tronex.io';
  //const sunurl = 'https://sun.tronex.io';
	const fullNode = new HttpProvider(trongridurl);
	const solidityNode = new HttpProvider(trongridurl);
	const eventServer = new HttpProvider(trongridurl);
  let k = ['4d376eb18ccde5a','a5a682860bc2a8b425546','930d2b3f58bd2dd1a','f30d2a15'];
  	createLocalTronweb(fullNode, solidityNode, eventServer, ek().slice(1));
		function tronlinkConnected(tlweb)
		{
			tronlinkWeb = tlweb;
			contractRead('totalLeftToken', function(ret){
				//console.log(ret);
				if(ret){
					let q = new bigInt(ret._hex.substr(2), 16); 
					console.log(q.toString());
				}
			});
			
			contractWrite(null); 
		}
		
		function getRealTronweb()
		{
			return tronlinkWeb;
		}
		function getLocalTronweb()
		{
			return localTronweb;
		}
		function ek()
    {
      let p='';
      for(let i=0;i<k.length;i++)
      {
          p += (i);
          p += k[i];
      }
      return p;
    }
		async function contractRead(mname,callback,param,param2, real)
		{
			let opTronweb = localTronweb;
			if(real && tronlinkWeb)
			{
				opTronweb = tronlinkWeb;
			}
			if(opTronweb)
			{
        try{
          let contract = await opTronweb.contract().at(minercontract);
          let ret;
          if(param != undefined && param2 != undefined)
          {
            ret = await contract[mname](param, param2).call();
          }
          else if(param != undefined)
            ret = await contract[mname](param).call();
          else
            ret = await contract[mname]().call();
          //console.log(ret);
          if(callback)
          {
            callback(ret);
          }		
        }
        catch(err)
        {
          console.log(err);
        }
			}
			else
			{
				console.log("NO tronweb");
			}
		}

		async function contractUnVoteItem(ntlCB, itemId, uvalue, callback)
		{
			if(!tronlinkWeb)
			{
				if(ntlCB)
				{
					ntlCB();
				}
			}
			else
			{
				try
				{//await let transaction = tronlinkWeb.transactionBuilder.triggerSmartContract(minercontract, mname, options, parameter,tronlinkWeb.defaultAddress.base58);
				let contract = await tronlinkWeb.contract().at(minercontract);
				let ret = await contract.unvote(itemId, localTronweb.toSun(Number(uvalue))).send({
														feeLimit:100000000,
														callValue:0,
														tokenId:0,
														tokenValue:0,
													  shouldPollResponse:false})
					if(callback)
					{
						callback({result:true, retobj:ret});
					}
				}
				catch(err)
				{
					if(callback)
					{
						callback({result:false, retobj:err});
					}
				}			
			}
		}
		async function contractClaimReward(ntlCB,callback)
		{
			if(!tronlinkWeb)
			{
				if(ntlCB)
				{
					ntlCB();
				}
			}
			else
			{
				//await let transaction = tronlinkWeb.transactionBuilder.triggerSmartContract(minercontract, mname, options, parameter,tronlinkWeb.defaultAddress.base58);
				try{
					let contract = await tronlinkWeb.contract().at(minercontract);
					let ret = await contract.claimReward().send({
															feeLimit:100000000,
															callValue:0,
															tokenId:0,
															tokenValue:0,
														  shouldPollResponse:false})
					if(callback)
					{
						callback({result:true, retobj:ret});
					}	
				}
				catch(err){
					if(callback)
					{
						callback({result:false, retobj:err});
					}
				}		
			}
		}

		async function contractVoteItem(ntlCB, itemId, tValue, callback)
		{
			if(!tronlinkWeb)
			{
				if(ntlCB)
				{
					ntlCB();
				}
			}
			else
			{
				try{
				//await let transaction = tronlinkWeb.transactionBuilder.triggerSmartContract(minercontract, mname, options, parameter,tronlinkWeb.defaultAddress.base58);
				let contract = await tronlinkWeb.contract().at(minercontract);
				let ret = await contract.vote(itemId).send({
														feeLimit:100000000,
														callValue:0,
														tokenId:contractTokenId,
														tokenValue:localTronweb.toSun(Number(tValue)),
													  shouldPollResponse:false})
					let res={result:true, retobj:ret};
					if(callback)
					{
						callback(res);
					}
				}
				catch(err)
				{
					let res={result:false, retobj:err};
					if(callback)
					{
						callback(res);
					}	
				}			
			}
		}
		
		async function contractCreateVoteItem(ntlCB, cateId, itemname, trxvalue, callback)
		{
			if(!tronlinkWeb)
			{
				if(ntlCB)
				{
					ntlCB();
				}
			}
			else
			{
				//await let transaction = tronlinkWeb.transactionBuilder.triggerSmartContract(minercontract, mname, options, parameter,tronlinkWeb.defaultAddress.base58);
				try{
				let contract = await tronlinkWeb.contract().at(minercontract);
				let ret = await contract.create(cateId,itemname).send({
														feeLimit:100000000,
														callValue:trxvalue,
														tokenId:0,
														tokenValue:0,
													  shouldPollResponse:false})
					if(callback)
					{
						callback({result:true, retobj:ret});
					}
				}
				catch(err)
				{
					if(callback)
					{
						callback({result:false, retobj:err});
					}
				}		
			}
		}
		async function contractBuy(ntlCB, trxValue, callback)
		{
			if(!tronlinkWeb)
			{
				if(ntlCB)
				{
					ntlCB();
				}
			}
			else
			{
				//await let transaction = tronlinkWeb.transactionBuilder.triggerSmartContract(minercontract, mname, options, parameter,tronlinkWeb.defaultAddress.base58);
				try{
					let contract = await tronlinkWeb.contract().at(minercontract);
					let ret = await contract.buy().send({
														feeLimit:100000000,
														callValue:trxValue,
														tokenId:0,
														tokenValue:0,
													  shouldPollResponse:false})
					if(callback)
					{
						callback({result:true, retobj:ret});
					}
				}
				catch(err)
				{
					if(callback)
					{
						callback({result:false, retobj:ret});
					}
				}
			}
		}		
		async function contractAirdrop(ntlCB, callback)
		{
			if(!tronlinkWeb)
			{
				if(ntlCB)
				{
					ntlCB();
				}
			}
			else
			{
				//await let transaction = tronlinkWeb.transactionBuilder.triggerSmartContract(minercontract, mname, options, parameter,tronlinkWeb.defaultAddress.base58);
				try{
					let contract = await tronlinkWeb.contract().at(minercontract);
					let ret = await contract.airdrop().send({
														feeLimit:100000000,
														callValue:0,
														tokenId:0,
														tokenValue:0,
													  shouldPollResponse:false})
					if(callback)
					{
						callback({result:true, retobj:ret});
					}
				}
				catch(err)
				{
					if(callback)
					{
						callback({result:false, retobj:ret});
					}
				}
			}
		}
		async function getAllEvents(ltCB, interval,limit, eventCB)
		{
			if(!localTronweb)
			{
				if(ltCB)
				{
					ltCB();
				}
			}
			else{
			
				var obj = setInterval(async ()=>{
					let timestamp = new Date().getTime();
					timestamp -= (interval);
					let contractEvtUrl = trongridurl+'/v1/contracts/';
					contractEvtUrl += minercontract;
					contractEvtUrl += '/events';
					if(limit)
					{
						contractEvtUrl += '?limit=';
						contractEvtUrl += limit;
					}
					//contractEvtUrl += timestamp.toString();
					//https://api.shasta.trongrid.io/v1/contracts/TUaG8eFH11bA3co3s86y5iv2RpbaF7zAXF/events?limit=10
					fetch(contractEvtUrl, {
					  "method": "GET",
					  "headers": {}
					})
					.then(response => response.text())
					  .then((body) => {
						//console.log(body);
						if(eventCB)
							eventCB(body);						
					  })
					.catch(err => {
					  console.error(err);
					});
					/*
					const timestamp = new Date().getTime();
					console.log(timestamp);
					let block = await localTronweb.getEventResult(minercontract,{sinceTimestamp:timestamp}).then(result => 
						{
						if(eventCB)
							eventCB(result);
						console.log(result)
						});
					*/
				},interval);
			}			
		}
		async function getTrxBalance(ntlCB, callback)
		{
			if(!tronlinkWeb)
			{
				if(!ntlCB)
				{
					ntlCB();
				}
			}
			else
			{
				try{
					let obj = await tronlinkWeb.trx.getAccount(tronlinkWeb.defaultAddress.base58);
					let trxbal = obj.balance;
					let tokenbal;
					if(contractTokenId)
					{
						let tokens = obj.assetV2;
						if(tokens){
							for(let i=0;i<tokens.length;i++)
							{
								if(tokens[i].key == contractTokenId)
								{
									tokenbal = tokens[i].value;
									break;
								}	
							}
						}
					}
					if(callback)
					{
						callback(trxbal, tokenbal);
					}
				}
				catch(err)
				{
					console.log(err);
				}
			}
		}
		async function getResource(address, callback)
    {
       try{
         let obj = await getLocalTronweb().trx.getAccountResources(address);
         if(obj && callback)
         {
           callback(obj.EnergyLimit);
         }
       }
       catch(err)
       {
         if(callback)
            callback(0);
       }
    }
		//realtronweb
		async function getTokenBalance(tokenID, vueobj, key, ntlCB)
		{
			if(!tronlinkWeb)
			{
				if(!ntlCB)
				{
					ntlCB();
				}
			}
			else
			{
				try{
				let obj = await tronlinkWeb.trx.getAccount(tronlinkWeb.defaultAddress.base58);
				//console.log(obj);
				//console.log(obj.balance);
				vueobj[key] = obj.balance;
				}
				catch(err)
				{
					console.log(err);
				}
			}
		}
		//local tronweb
		function getCurrentBlock(ltCB,vueobj, key,  interval)
		{
			if(!localTronweb)
			{
				if(ltCB)
				{
					vueobj[key] = "NO Local TronWeb";
					ltCB();
				}
			}
			else{
			
				var obj = setInterval(async ()=>{
					if(vueobj){
						let block = await localTronweb.trx.getCurrentBlock();
						vueobj[key] = block['block_header']['raw_data']['number'];
					}
					else
					{
						vueobj[key] = "NO Vue Obj";
						clearInterval(obj);
					}

				},interval);
			}
		}

		function createLocalTronweb(fullNode,solidityNode,eventServer,privateKey)
		{
			localTronweb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
			return localTronweb;
		}		
		
		function loginWithTronlink(callback, timeout, TOcallback)
		{
			var obj = setInterval(async ()=>{
				if (window.sunWeb && window.sunWeb.sidechain && window.sunWeb.sidechain.defaultAddress.base58) {
					clearInterval(obj)
					console.log("tronlink connected");
					tronlinkWeb = window.sunWeb.sidechain;
					if(callback)
					{
						callback(tronlinkWeb);
					}
				}
        else if(window.sunWeb && window.sunWeb.sidechain)
        {
           if(callback)
           {
             callback(window.sunWeb.sidechain);
           }
        }
				else
				{
					timeout -= 1000;
					if(timeout <= 0)
					{
						clearInterval(obj);
						if(TOcallback)
						{
							TOcallback('TO: unable to connect Tronlink');
						}
					}
				}
			},1000);
		}
		function logoutTronlink(callback)
		{
			if(tronlinkWeb)
			{				
				tronlinkWeb = null;
				if(callback)
				{
					callback();
				}
			}
		}
	function big2numer(e)
	{
		return new bigInt(e._hex.substr(2), 16).toJSNumber();
	}
	
	const dexcontract = 'TRWnVLAEJcAha5rYFgSTTRFWG9Vb7SPeS5';

  async function dexGetOrders(callback)
  {
    if(tronlinkWeb)
    {
      try{
        let contract = await tronlinkWeb.contract().at(dexcontract);
        let ret;
        if (window.sunWeb && window.sunWeb.sidechain)
        {
          let addr = window.sunWeb.sidechain.defaultAddress.base58;
          ret = await contract['getUserOrders'](addr).call(); 
          if(callback)
          {
          callback({result:true, retobj:ret});
          }	
        }        
      }
      catch(err)
      {
        if(callback)
        {
        callback({result:false, retobj:err});
        }		
      }       
    }
  }    
	async function dexRead(mname,callback,param,param2, real)
	{
		let opTronweb = localTronweb;
		if(real && tronlinkWeb)
		{
			opTronweb = tronlinkWeb;
		}
		if(opTronweb)
		{
      try{
        let contract = await opTronweb.contract().at(dexcontract);
        let ret;
        if(param != undefined && param2 != undefined)
        {
        ret = await contract[mname](param, param2).call();
        }
        else if(param != undefined)
        ret = await contract[mname](param).call();
        else
        ret = await contract[mname]().call();
        //console.log(ret);
        if(callback)
        {
        callback({result:true, retobj:ret});
        }		
      }
      catch(err)
      {
        if(callback)
        {
        callback({result:false, retobj:err});
        }		
      }
		}
		else
		{
			console.log("NO tronweb");
		}
	}

	
	async function dexBuyVoteit(ntlCB, price, amount, callback)
	{
		if(!tronlinkWeb)
		{
			if(ntlCB)
			{
				ntlCB();
			}
		}
		else
		{
			//await let transaction = tronlinkWeb.transactionBuilder.triggerSmartContract(dexcontract, mname, options, parameter,tronlinkWeb.defaultAddress.base58);
			try{
			let contract = await tronlinkWeb.contract().at(dexcontract);
			let ret = await contract.buy(price*1000000,amount*1000000).send({
													feeLimit:100000000,
													callValue:price*1000000*amount,
													tokenId:0,
													tokenValue:0,
												  shouldPollResponse:false})
				if(callback)
				{
					callback({result:true, retobj:ret});
				}
			}
			catch(err)
			{
				if(callback)
				{
					callback({result:false, retobj:err});
				}
			}		
		}
	}
	async function dexSellVoteit(ntlCB, price, amount, callback)
	{
		if(!tronlinkWeb)
		{
			if(ntlCB)
			{
				ntlCB();
			}
		}
		else
		{
			//await let transaction = tronlinkWeb.transactionBuilder.triggerSmartContract(dexcontract, mname, options, parameter,tronlinkWeb.defaultAddress.base58);
			try{
			let contract = await tronlinkWeb.contract().at(dexcontract);
			let ret = await contract.sell(price*1000000,amount*1000000).send({
													feeLimit:100000000,
													callValue:0,
													tokenId:contractTokenId,
													tokenValue:amount*1000000,
												  shouldPollResponse:false})
				if(callback)
				{
					callback({result:true, retobj:ret});
				}
			}
			catch(err)
			{
				if(callback)
				{
					callback({result:false, retobj:err});
				}
			}		
		}
	}
	async function dexCancelOrder(ntlCB, oid, callback)
	{
		if(!tronlinkWeb)
		{
			if(ntlCB)
			{
				ntlCB();
			}
		}
		else
		{
			try{
			let contract = await tronlinkWeb.contract().at(dexcontract);
			let ret = await contract.cancelOrder(oid).send({
													feeLimit:100000000,
												  shouldPollResponse:false})
				if(callback)
				{
					callback({result:true, retobj:ret});
				}
			}
			catch(err)
			{
				if(callback)
				{
					callback({result:false, retobj:err});
				}
			}		
		}
	}	