var myCarousel = document.querySelector('#myCarousel')
var carousel = new bootstrap.Carousel(myCarousel)
let localTronweb = null;
let tronlinkWeb = null;
let vue_pets = null;

const VIEW_RANK = 1;
const VIEW_DEX = 2;
const VIEW_BET = 3;
const VIEW_PET = 4;
let view_type = VIEW_RANK;
let contractTokenId = '1003606';
const minercontract = 'TECu9sH4r5BZ373yBgBDsS3chC4s24cePA';
const petcontract = 'TS3TWBDgLnBBTd15BFK6jJDK8YPGgNmCKZ';
const HttpProvider = TronWeb.providers.HttpProvider;
const trongridurl = 'https://sun.tronex.io';
//const sunurl = 'https://sun.tronex.io';
const fullNode = new HttpProvider(trongridurl);
const solidityNode = new HttpProvider(trongridurl);
const eventServer = new HttpProvider(trongridurl);
let k = ['4d376eb18ccde5a', 'a5a682860bc2a8b425546', '930d2b3f58bd2dd1a', 'f30d2a15'];
createLocalTronweb(fullNode, solidityNode, eventServer, ek().slice(1));

function tronlinkConnected(tlweb) {
    tronlinkWeb = tlweb;
    contractRead('totalLeftToken', function(ret) {
        //console.log(ret);
        if (ret) {
            let q = new bigInt(ret._hex.substr(2), 16);
            console.log(q.toString());
        }
    });

    //contractWrite(null);
}

function getRealTronweb() {
    return tronlinkWeb;
}

function getLocalTronweb() {
    return localTronweb;
}

function ek() {
    let p = '';
    for (let i = 0; i < k.length; i++) {
        p += (i);
        p += k[i];
    }
    return p;
}
async function contractRead(mname, callback, param, param2, real) {
    let opTronweb = localTronweb;
    if (real && tronlinkWeb) {
        opTronweb = tronlinkWeb;
    }
    if (opTronweb) {
        try {
            let contract = await opTronweb.contract().at(minercontract);
            let ret;
            if (param != undefined && param2 != undefined) {
                ret = await contract[mname](param, param2).call();
            } else if (param != undefined)
                ret = await contract[mname](param).call();
            else
                ret = await contract[mname]().call();
            //console.log(ret);
            if (callback) {
                callback(ret);
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log("NO tronweb");
    }
}

async function contractUnVoteItem(ntlCB, itemId, uvalue, callback) {
    if (!tronlinkWeb) {
        if (ntlCB) {
            ntlCB();
        }
    } else {
        try { //await let transaction = tronlinkWeb.transactionBuilder.triggerSmartContract(minercontract, mname, options, parameter,tronlinkWeb.defaultAddress.base58);
            let contract = await tronlinkWeb.contract().at(minercontract);
            let ret = await contract.unvote(itemId, localTronweb.toSun(Number(uvalue))).send({
                feeLimit: 100000000,
                callValue: 0,
                tokenId: 0,
                tokenValue: 0,
                shouldPollResponse: false
            })
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (err) {
            if (callback) {
                callback({
                    result: false,
                    retobj: err
                });
            }
        }
    }
}
async function contractClaimReward(ntlCB, callback) {
    if (!tronlinkWeb) {
        if (ntlCB) {
            ntlCB();
        }
    } else {
        //await let transaction = tronlinkWeb.transactionBuilder.triggerSmartContract(minercontract, mname, options, parameter,tronlinkWeb.defaultAddress.base58);
        try {
            let contract = await tronlinkWeb.contract().at(minercontract);
            let ret = await contract.claimReward().send({
                feeLimit: 100000000,
                callValue: 0,
                tokenId: 0,
                tokenValue: 0,
                shouldPollResponse: false
            })
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (err) {
            if (callback) {
                callback({
                    result: false,
                    retobj: err
                });
            }
        }
    }
}

async function contractVoteItem(ntlCB, itemId, tValue, callback) {
    if (!tronlinkWeb) {
        if (ntlCB) {
            ntlCB();
        }
    } else {
        try {
            //await let transaction = tronlinkWeb.transactionBuilder.triggerSmartContract(minercontract, mname, options, parameter,tronlinkWeb.defaultAddress.base58);
            let contract = await tronlinkWeb.contract().at(minercontract);
            let ret = await contract.vote(itemId).send({
                feeLimit: 100000000,
                callValue: 0,
                tokenId: contractTokenId,
                tokenValue: localTronweb.toSun(Number(tValue)),
                shouldPollResponse: false
            })
            let res = {
                result: true,
                retobj: ret
            };
            if (callback) {
                callback(res);
            }
        } catch (err) {
            let res = {
                result: false,
                retobj: err
            };
            if (callback) {
                callback(res);
            }
        }
    }
}

async function contractCreateVoteItem(ntlCB, cateId, itemname, trxvalue, callback) {
    if (!tronlinkWeb) {
        if (ntlCB) {
            ntlCB();
        }
    } else {
        //await let transaction = tronlinkWeb.transactionBuilder.triggerSmartContract(minercontract, mname, options, parameter,tronlinkWeb.defaultAddress.base58);
        try {
            let contract = await tronlinkWeb.contract().at(minercontract);
            let ret = await contract.create(cateId, itemname).send({
                feeLimit: 100000000,
                callValue: trxvalue,
                tokenId: 0,
                tokenValue: 0,
                shouldPollResponse: false
            })
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (err) {
            if (callback) {
                callback({
                    result: false,
                    retobj: err
                });
            }
        }
    }
}
async function contractBuy(ntlCB, trxValue, callback) {
    if (!tronlinkWeb) {
        if (ntlCB) {
            ntlCB();
        }
    } else {
        //await let transaction = tronlinkWeb.transactionBuilder.triggerSmartContract(minercontract, mname, options, parameter,tronlinkWeb.defaultAddress.base58);
        try {
            let contract = await tronlinkWeb.contract().at(minercontract);
            let ret = await contract.buy().send({
                feeLimit: 100000000,
                callValue: trxValue,
                tokenId: 0,
                tokenValue: 0,
                shouldPollResponse: false
            })
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (err) {
            if (callback) {
                callback({
                    result: false,
                    retobj: ret
                });
            }
        }
    }
}
async function contractAirdrop(ntlCB, callback) {
    if (!tronlinkWeb) {
        if (ntlCB) {
            ntlCB();
        }
    } else {
        //await let transaction = tronlinkWeb.transactionBuilder.triggerSmartContract(minercontract, mname, options, parameter,tronlinkWeb.defaultAddress.base58);
        try {
            let contract = await tronlinkWeb.contract().at(minercontract);
            let ret = await contract.airdrop().send({
                feeLimit: 100000000,
                callValue: 0,
                tokenId: 0,
                tokenValue: 0,
                shouldPollResponse: false
            })
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (err) {
            if (callback) {
                callback({
                    result: false,
                    retobj: ret
                });
            }
        }
    }
}
async function getAllEvents(ltCB, interval, limit, eventCB) {
    if (!localTronweb) {
        if (ltCB) {
            ltCB();
        }
    } else {

        var obj = setInterval(async () => {
            let timestamp = new Date().getTime();
            timestamp -= (interval);
            let contractEvtUrl = trongridurl + '/v1/contracts/';
            contractEvtUrl += minercontract;
            contractEvtUrl += '/events';
            if (limit) {
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
                    if (eventCB)
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
        }, interval);
    }
}
async function getTrxBalance(ntlCB, callback) {
    if (!tronlinkWeb) {
        if (!ntlCB) {
            ntlCB();
        }
    } else {
        try {
            let obj = await tronlinkWeb.trx.getAccount(tronlinkWeb.defaultAddress.base58);
            let trxbal = obj.balance;
            let tokenbal;
            if (contractTokenId) {
                let tokens = obj.assetV2;
                if (tokens) {
                    for (let i = 0; i < tokens.length; i++) {
                        if (tokens[i].key == contractTokenId) {
                            tokenbal = tokens[i].value;
                            break;
                        }
                    }
                }
            }
            if (callback) {
                callback(trxbal, tokenbal);
            }
        } catch (err) {
            console.log(err);
        }
    }
}
async function getResource(address, callback) {
    try {
        let obj = await getLocalTronweb().trx.getAccountResources(address);
        if (obj && callback) {
            callback(obj.EnergyLimit);
        }
    } catch (err) {
        if (callback)
            callback(0);
    }
}
//realtronweb
async function getTokenBalance(tokenID, vueobj, key, ntlCB) {
    if (!tronlinkWeb) {
        if (!ntlCB) {
            ntlCB();
        }
    } else {
        try {
            let obj = await tronlinkWeb.trx.getAccount(tronlinkWeb.defaultAddress.base58);
            //console.log(obj);
            //console.log(obj.balance);
            vueobj[key] = obj.balance;
        } catch (err) {
            console.log(err);
        }
    }
}
//local tronweb
async function getCurrentBlock(callback) {
    try {
        if (localTronweb) {
            let block = await localTronweb.trx.getCurrentBlock();
            if (callback) {
                callback(block['block_header']['raw_data']['number'], block['blockID']);
            }
        }
    } catch (error) {
        console.log(error);
    }

}
async function getBlock(bn, callback) {
    try {
        let block = await localTronweb.trx.getBlockByNumber(bn);
        if (callback) {
            callback(block['blockID']);
        }
    } catch (error) {
        console.log(error);
    }

}
async function getBlockRange(startb, endb, callback) {
    try {
        let blocks = await localTronweb.trx.getBlockRange(startb, endb);
        if (callback) {
            callback(blocks);
        }
    } catch (error) {
        console.log(error);
    }
}

function createLocalTronweb(fullNode, solidityNode, eventServer, privateKey) {
    localTronweb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
    return localTronweb;
}

function loginWithTronlink(callback, timeout, TOcallback) {
    var obj = setInterval(async () => {
        if (window.sunWeb && window.sunWeb.sidechain && window.sunWeb.sidechain.defaultAddress.base58) {
            clearInterval(obj)
            console.log("tronlink connected");
            tronlinkWeb = window.sunWeb.sidechain;
            if (callback) {
                callback(tronlinkWeb);
            }
        } else if (window.sunWeb && window.sunWeb.sidechain) {
            if (callback) {
                callback(window.sunWeb.sidechain);
            }
        } else {
            timeout -= 1000;
            if (timeout <= 0) {
                clearInterval(obj);
                if (TOcallback) {
                    TOcallback('TO: unable to connect Tronlink');
                }
            }
        }
    }, 1000);
}

function logoutTronlink(callback) {
    if (tronlinkWeb) {
        tronlinkWeb = null;
        if (callback) {
            callback();
        }
    }
}

function big2number(e) {
    return new bigInt(e._hex.substr(2), 16).toJSNumber();
}

const dexcontract = 'TRWnVLAEJcAha5rYFgSTTRFWG9Vb7SPeS5';

async function dexGetOrders(callback) {
    if (tronlinkWeb) {
        try {
            let contract = await tronlinkWeb.contract().at(dexcontract);
            let ret;
            if (window.sunWeb && window.sunWeb.sidechain) {
                let addr = window.sunWeb.sidechain.defaultAddress.base58;
                ret = await contract['getUserOrders'](addr).call();
                if (callback) {
                    callback({
                        result: true,
                        retobj: ret
                    });
                }
            }
        } catch (err) {
            if (callback) {
                callback({
                    result: false,
                    retobj: err
                });
            }
        }
    }
}
async function dexRead(mname, callback, param, param2, real) {
    let opTronweb = localTronweb;
    if (real && tronlinkWeb) {
        opTronweb = tronlinkWeb;
    }
    if (opTronweb) {
        try {
            let contract = await opTronweb.contract().at(dexcontract);
            let ret;
            if (param != undefined && param2 != undefined) {
                ret = await contract[mname](param, param2).call();
            } else if (param != undefined)
                ret = await contract[mname](param).call();
            else
                ret = await contract[mname]().call();
            //console.log(ret);
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (err) {
            if (callback) {
                callback({
                    result: false,
                    retobj: err
                });
            }
        }
    } else {
        console.log("NO tronweb");
    }
}


async function dexBuyVoteit(ntlCB, price, amount, callback) {
    if (!tronlinkWeb) {
        if (ntlCB) {
            ntlCB();
        }
    } else {
        //await let transaction = tronlinkWeb.transactionBuilder.triggerSmartContract(dexcontract, mname, options, parameter,tronlinkWeb.defaultAddress.base58);
        try {
            let contract = await tronlinkWeb.contract().at(dexcontract);
            let ret = await contract.buy(price * 1000000, amount * 1000000).send({
                feeLimit: 100000000,
                callValue: price * 1000000 * amount,
                tokenId: 0,
                tokenValue: 0,
                shouldPollResponse: false
            })
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (err) {
            if (callback) {
                callback({
                    result: false,
                    retobj: err
                });
            }
        }
    }
}
async function dexSellVoteit(ntlCB, price, amount, callback) {
    if (!tronlinkWeb) {
        if (ntlCB) {
            ntlCB();
        }
    } else {
        //await let transaction = tronlinkWeb.transactionBuilder.triggerSmartContract(dexcontract, mname, options, parameter,tronlinkWeb.defaultAddress.base58);
        try {
            let contract = await tronlinkWeb.contract().at(dexcontract);
            let ret = await contract.sell(price * 1000000, amount * 1000000).send({
                feeLimit: 100000000,
                callValue: 0,
                tokenId: contractTokenId,
                tokenValue: amount * 1000000,
                shouldPollResponse: false
            })
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (err) {
            if (callback) {
                callback({
                    result: false,
                    retobj: err
                });
            }
        }
    }
}
async function dexCancelOrder(ntlCB, oid, callback) {
    if (!tronlinkWeb) {
        if (ntlCB) {
            ntlCB();
        }
    } else {
        try {
            let contract = await tronlinkWeb.contract().at(dexcontract);
            let ret = await contract.cancelOrder(oid).send({
                feeLimit: 100000000,
                shouldPollResponse: false
            })
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (err) {
            if (callback) {
                callback({
                    result: false,
                    retobj: err
                });
            }
        }
    }
}
//wallet

var voteModalObj;
var vue_dex = null;
let vue_signdays = null;
const DECIMALS = 1000000;
var walletv = new Vue({
    el: '#v_wallet',
    data: {
        cateId: 1,
        tlconneting: false,
        tlconnected: false,
        ConnectWallet: 'Connect Tronlink',
        wallet: 'wallet',
        trxBalance: 0,
        tokenBalance: 0,
        energyLeft: 0
    },
    methods: {
        connectWallet: function() {
            if (!walletv.tlconnected) {
                //connect tronlink
                walletv.wallet = "Connecting Tronlink"
                walletv.tlconneting = true;
                loginWithTronlink(
                    function(tlweb) {
                        walletv.tlconnected = true;
                        walletv.tlconneting = false;


                        readUserOrders();
                        let addr = tlweb.defaultAddress.base58
                        if (addr) {
                            vue_signdays.addr = addr;
                            vue_signdays.getSignInfo();
                            walletv.wallet = (addr.substring(0, 5) + "..." + addr.substring(addr.length - 5));
                            var balobj = setInterval(async () => {
                                if (!walletv.tlconnected) {
                                    clearInterval(balobj);
                                }
                                getTrxBalance(tronlinkNotConnected, function(trx, token) {
                                    walletv.trxBalance = trx / DECIMALS;
                                    walletv.tokenBalance = token / DECIMALS;
                                    if (vue_dex) {
                                        vue_dex.trxBalance = walletv.trxBalance;
                                        vue_dex.tokenBalance = walletv.tokenBalance;
                                    }
                                    if (getRealTronweb() && getRealTronweb().defaultAddress.base58) {
                                        let addr = getRealTronweb().defaultAddress.base58
                                        walletv.wallet = (addr.substring(0, 5) + "..." + addr.substring(addr.length - 5));
                                    }
                                });
                            }, 5000);
                        } else {
                            walletv.wallet = "Please login tronlink first";
                            walletv.tlconneting = false;
                            walletv.tlconnected = false;
                        }
                    },
                    30000,
                    function(type) {
                        {
                            walletv.tlconneting = false;
                            walletv.tlconnected = false;
                            walletv.wallet = "Cannot connect Tronlink"

                            var myModal = new bootstrap.Modal(document.getElementById('tronlinkModal'), null);
                            myModal.show();
                        }
                    });
                walletv.tlconnected = 1;
            }
        },
        exitWallet: function() {
            logoutTronlink(function() {
                walletv.tlconnected = false;
                walletv.wallet = "wallet";
                walletv.trxBalance = 0;
                walletv.tokenBalance = 0;
            })
        }
    }
})
var votemodalv = new Vue({
    el: '#voteModal',
    data: {
        isVote: 'true',
        itemId: 0,
        itemName: '',
        inputVotes: 0,
        tokenBalance: 0,
        indicator: '',
        alleventv: null,
        //1,vote,2:vote done;3:unvote;4:uv done
        callback: null
    },
    computed: {
        title: function() {
            if (this.isVote) {
                return 'Vote';
            } else
                return 'UnVote';
        },
        titleBalance: function() {
            if (this.isVote) {
                return 'VOTEIT balance:';
            } else
                return 'Vote balance:';
        }
    },
    methods: {
        reset: function() {
            this.inputVotes = '';
            this.indicator = '';
            this.tokenBalance = 0;

        },
        confirmVote: function() {
            this.indicator = "waiting for tronlink  to sign";
            let itemId = this.itemId;
            if (this.isVote) {
                if (this.callback) {
                    this.callback(1);
                }
                presetranks[itemId].voting = true;
                voteModalObj.hide();
                let votes = Number(this.inputVotes);
                if (votes <= 0) {
                    votemodalv.indicator = "cannot vote 0";
                    return;
                }
                if (this.alleventv)
                    this.alleventv.pushWaitingEvent("Voting");
                contractVoteItem(tronlinkNotConnected,
                    this.itemId,
                    this.inputVotes,
                    function(ret) {
                        if (votemodalv.alleventv)
                            votemodalv.alleventv.pushVoteEvent(presetranks[itemId].name, votes, ret);
                        presetranks[itemId].voting = false;
                        if (votemodalv.callback) {
                            votemodalv.callback(2);
                        }
                        console.log(ret);
                        if (ret) {
                            votemodalv.indicator = "Voted successfully";
                        } else {
                            votemodalv.indicator = "Failed to vote";
                        }
                    })
            } else {
                if (this.inputVotes > this.vote) {
                    this.indicator = "you can only unvote your votes";
                    return;
                }
                if (this.callback) {
                    this.callback(3);
                }
                presetranks[itemId].unvoting = true;
                voteModalObj.hide();
                let unvotes = Number(this.inputVotes);
                if (this.alleventv)
                    alleventv.pushWaitingEvent("UnVoting");
                contractUnVoteItem(tronlinkNotConnected,
                    this.itemId,
                    this.inputVotes,
                    function(ret) {
                        presetranks[itemId].unvoting = false;
                        if (votemodalv.alleventv)
                            alleventv.pushUnVoteEvent(presetranks[itemId].name, unvotes, ret);
                        if (votemodalv.callback) {
                            votemodalv.callback(4);
                        }
                        if (ret.result) {
                            votemodalv.indicator = "UnVoted successfully";
                        } else {
                            votemodalv.indicator = "Failed to unvote:" + ret.retobj;
                        }
                    })
            }
        }
    }
})

function tronlinkNotConnected() {
    console.log("No Tronlink connected");
    var myModal = new bootstrap.Modal(document.getElementById('connectWalletModal'), null);
    myModal.show();
}

function voteItem(e) {
    let itemid = Number(e.getAttribute('itemid'));

    if (!getRealTronweb()) {
        tronlinkNotConnected();
    } else {

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

function unVoteItem(e) {
    let itemid = Number(e.getAttribute('itemid'));

    if (!getRealTronweb()) {
        tronlinkNotConnected();
    } else {
        votemodalv.reset();
        contractRead('getUserVotes', function(ret) {
            votemodalv.tokenBalance = big2number(ret) / DECIMALS;
        }, getRealTronweb().defaultAddress.base58, itemid, true);
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
    el: '#signindays',
    data: {
        addr: '',
        total: 0,
        contDays: 0,
        alleventv: null,
        daysreward: [5, 10, 15, 20, 25, 30, 50, 10, 15, 20, 25, 30, 35, 60, 100],
    },
    methods: {
        claimSignReward: function() {
            if (!getRealTronweb()) {
                tronlinkNotConnected();
            } else {
                if (alleventv)
                    alleventv.pushWaitingEvent("Signin Rewards");
                claimSigninReward(function(ret) {
                    alleventv.pushClaimEvent(ret);
                    if (ret.result) {
                        vue_signdays.getSignInfo();
                    }
                })
            }
        },
        getSignInfo: function() {
            getUserSignInfo(vue_signdays.addr, function(ret1) {
                if (ret1.result) {
                    vue_signdays.contDays = big2number(ret1.retobj.contDays);
                }
            });
        }
    }
});

async function signinUser(addr, callback) {
    try {
        let contract = await localTronweb.contract().at(signincontract);
        let ret = await contract.userSignin(addr).send({
            feeLimit: 100_000_000,
            callValue: 0,
            tokenId: 0,
            tokenValue: 0,
            shouldPollResponse: false
        });
        console.log(ret);
        if (callback) {
            callback({
                result: true,
                retobj: ret
            });
        }
    } catch (error) {
        if (callback) {
            callback({
                result: false,
                retobj: error
            });
        }
    }
}
async function claimSigninReward(callback) {
    if (!tronlinkWeb) {
        tronlinkNotConnected();
    } else {
        try {
            let contract = await tronlinkWeb.contract().at(signincontract);
            let ret = await contract.claimSigninReward().send({
                feeLimit: 100_000_000,
                callValue: 0,
                tokenId: 0,
                tokenValue: 0,
                shouldPollResponse: false
            });
            console.log(ret);
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (error) {
            if (callback) {
                callback({
                    result: false,
                    retobj: error
                });
            }
        }
    }
}
async function getUserSignInfo(addr, callback) {
    try {
        let contract = await localTronweb.contract().at(signincontract);
        let ret = await contract.getUserInfo(addr).call({
            feeLimit: 100_000_000,
            callValue: 0,
            tokenId: 0,
            tokenValue: 0,
            shouldPollResponse: false
        });

        if (callback) {
            callback({
                result: true,
                retobj: ret
            });
        }
    } catch (error) {
        if (callback) {
            callback({
                result: false,
                retobj: error
            });
        }
    }
}

function getParameter(param) {
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
let votechange = false;
let pkey1 = ['563492ad6f9170000', '000001231cf748a', '6141c593931fe', '88336', '7b'];


let vue_itemdetail = new Vue({
    el: '#v_itemdetail',
    data: {
        show: false,
        itemId: 0,
        searchname: '',
        name: '',
        rank: 0,
        vote: 0,
        cid: 0,
        voting: false,
        unvoting: false,
        vote2rise: 0,
        desc: '',
        imgs: [],
        originals: [],
        googleurl: '',
        wikiurl: '',
        voters: []
    },
    method: {
        imgPath: function(img) {
            return
        }
    }
})

function getkey() {
    let pk = '';
    for (let i = 0; i < pkey1.length; i++) {
        pk += (i);
        pk += pkey1[i];
    }
    return pk;
}

function updateItemsByCate(cateId) {
    contractRead('getCateItemsId', function(ret) {
        for (let i = 0; i < ret.length; i++) {
            let itemId = big2number(ret[i]);
            readItem(itemId);
        }
        refreshRanks();
    }, cateId);
}

function refreshRanks() {
    let cateitems = [];
    for (let i = 1; i < presetranks.length; i++) {
        if (!presetranks[i]) {
            console.log('undefined presetranks' + i);
        } else {
            if (presetranks[i].cateId == vue_itemdetail.cid) {
                cateitems.push(i);
            }
        }
    }
    cateitems.sort(function(l, r) {
        return presetranks[r].votes - presetranks[l].votes
    });
    let priorvote = 0;
    for (let i = 0; i < cateitems.length; i++) {
        presetranks[cateitems[i]].rank = i + 1;

        if (cateitems[i] == vue_itemdetail.itemId) {
            vue_itemdetail.rank = i + 1;
            if (i > 0) {
                vue_itemdetail.vote2rise = (priorvote - vue_itemdetail.vote).toFixed(6);
                if (vue_itemdetail.rank != 1 && vue_itemdetail.vote2rise == 0) {
                    vue_itemdetail.vote2rise = 0.000001;
                }
            } else {
                vue_itemdetail.vote2rise = 0;
            }
            break
        }

        priorvote = presetranks[cateitems[i]].votes;
    }
}


function fetchPhotos() {
    if (vue_itemdetail.imgs.length == 0) {
        //fetch from pexels

        fetch(encodeURI("https://api.pexels.com/v1/search?query=" + vue_itemdetail.name), {
                headers: {
                    Authorization: getkey().slice(1)
                }
            })
            .then(resp => {
                return resp.json()
            })
            .then(data => {
                if (data.photos) {
                    for (let i = 0; i < data.photos.length; i++) {
                        vue_itemdetail.imgs.push(data.photos[i].src.large);
                        vue_itemdetail.originals.push(data.photos[i].src.original);
                    }
                } else {

                }
            })
    }
}

function showItem(id) {
    vue_itemdetail.itemId = id;
    if (id < presetranks.length) {
        vue_itemdetail.name = presetranks[id].name;
        vue_itemdetail.vote = presetranks[id].votes;
        vue_itemdetail.cid = presetranks[id].cateId;
        vue_itemdetail.googleurl = encodeURI('https://www.google.com/search?q=' + vue_itemdetail.name);
        vue_itemdetail.wikiurl = encodeURI('https://en.wikipedia.org/wiki/' + vue_itemdetail.name);
        vue_itemdetail.show = true;
        vue_itemdetail.desc = '';
        vue_itemdetail.imgs = [];
        vue_itemdetail.originals = [];

        showEle('v_ranks', false);
        showEle('voteitdex', false);
        showEle('v_betgame', false);
        showEle('v_itemdetail', true);
        alleventv.mode = 2;
        if (rankItemDetails[id]) {
            vue_itemdetail.desc = rankItemDetails[id].desc;
            vue_itemdetail.imgs = rankItemDetails[id].imgs.split('|');
            for (let i = 0; i < vue_itemdetail.imgs.length; i++) {
                if (vue_itemdetail.imgs[i].indexOf('http') != 0) {
                    vue_itemdetail.imgs[i] = 'https://cdn.jsdelivr.net/gh/voteit-top/voteitimgs@0.0.1/imgs/' + vue_itemdetail.imgs[i];
                }
            }
        }
        updateItemsByCate(vue_itemdetail.cid);
        refreshRanks()
        fetchPhotos()
    }
}
//chunk
const contractOwner = "TCbLNGcJy1SzmoVrZvE1H1oY5mZbuzHhuM";
let defaultCateId = 0;
let curItemId = 0;
let cateNames = ['', 'Country/Region', 'Person', 'City', 'Resort', 'Brand', 'Crypto'];
//let presetranks=JSON.parse(allRanks);
let maxItemId = presetranks.length - 1;
const PAGESIZE = 55;
const EVENTCNT = 30;
var eventStart = 999;
var voteitModalObj;
var createModalObj;
var alleventv = new Vue({
    el: '#allevents_v',
    data: {
        mode: 1,
        lastbn: 0,
        orderType: ['', 'Buy', 'Sell'],
        orders: [],
        ordersMap: {},
        events: [],
        eventsMap: new Map(),
        myEvents: [],
        showMine: false,
        waiting: false,
        waitingText: ''
    },
    computed: {
        sidetitle: function() {
            if (this.mode == 2)
                return 'Supporters';
            else if (this.mode == 3)
                return 'Orders';
        }
    },
    methods: {
        cancelOrder: function(oid) {
            alleventv.pushWaitingEvent("Canel Order...");
            let idx = alleventv.ordersMap[oid];
            alleventv.orders[idx - 1].canceling = true;

            dexCancelOrder(tronlinkConnected, oid, function(ret) {
                alleventv.orders[idx - 1].canceling = false;
                alleventv.pushCancelOrder(oid, ret);
                readBuyPrices();
                readSellPrices();
                readUserOrders();
                if (ret.result) {
                    alleventv.orders.splice(idx - 1, 1);
                }
            })
        },
        switchSideTab: function() {
            let e = document.getElementById('link_sidetab');
            if (e)
                e.click();
        },
        switchMineTab: function() {
            let e = document.getElementById('link_myEvents');
            if (e)
                e.click();
        },
        pushWaitingEvent: function(name) {
            this.waiting = true;
            this.waitingText = name + '...waiting Tronlink to sign';
            this.switchMineTab();

        },
        pushPickPet:function(ret)
        {
           this.waiting = false;
           let evt ={};
           evt.name = "New Pet picked ";
           evt.error = !ret.result;
           if(ret.result){
                evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/' + ret.retobj;
                evt.details = "check transaction";
	   }else{
                evt.details = ret.retobj;
           }
            this.myEvents.unshift(evt);
            this.switchMineTab();
	},
        pushSellPetGem:function(name,pid, ret)
        {
           this.waiting = false;
           let evt ={};
           evt.name = "Sell " + name + " to Market " +  pid;
           evt.error = !ret.result;
           if(ret.result){
                evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/' + ret.retobj;
                evt.details = "check transaction";
	   }else{
                evt.details = ret.retobj;
           }
            this.myEvents.unshift(evt);
            this.switchMineTab();
	},
        pushFeedPet:function(pid, ret)
        {
           this.waiting = false;
           let evt ={};
           evt.name = "Pet feeded " +  pid;
           evt.error = !ret.result;
           if(ret.result){
                evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/' + ret.retobj;
                evt.details = "check transaction";
	   }else{
                evt.details = ret.retobj;
           }
            this.myEvents.unshift(evt);
            this.switchMineTab();
	},
        pushCancelOrder: function(oid, ret) {
            this.waiting = false;
            let evt = {};
            evt.name = "Order canceled " + oid;
            evt.error = !ret.result;
            if (ret.result) {
                evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/' + ret.retobj;
                evt.details = "check transaction";
            } else {
                evt.details = ret.retobj;
            }
            this.myEvents.unshift(evt);
            this.switchMineTab();
        },
        pushBuyVoteit: function(amount, ret) {
            this.waiting = false;
            let evt = {};
            evt.name = "Buy Voteit " + amount;
            evt.error = !ret.result;
            if (ret.result) {
                evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/' + ret.retobj;
                evt.details = "check transaction";
            } else {
                evt.details = ret.retobj;
            }
            this.myEvents.unshift(evt);
            this.switchMineTab();
        },
        pushSellVoteit: function(amount, ret) {
            this.waiting = false;
            let evt = {};
            evt.name = "Sell Voteit " + amount;
            evt.error = !ret.result;
            if (ret.result) {
                evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/' + ret.retobj;
                evt.details = "check transaction";
            } else {
                evt.details = ret.retobj;
            }
            this.myEvents.unshift(evt);
            this.switchMineTab();
        },
        pushBuyEvent: function(trxValue, ret) {
            this.waiting = false;
            let evt = {};
            evt.name = "Buy " + trxValue;
            evt.error = !ret.result;
            if (ret.result) {
                evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/' + ret.retobj;
                evt.details = "check transaction";
            } else {
                evt.details = ret.retobj;
            }
            this.myEvents.unshift(evt);
            this.switchMineTab();
        },
        pushAirdropEvent: function(ret) {
            this.waiting = false;
            let evt = {};
            evt.name = "Airdrop ";
            evt.error = !ret.result;
            if (ret.result) {
                evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/' + ret.retobj;
                evt.details = "check transaction";
            } else {
                evt.details = ret.retobj;
            }
            this.myEvents.unshift(evt);
            this.switchMineTab();
        },
        pushCreateEvent: function(name, ret) {
            this.waiting = false;
            let evt = {};
            evt.name = 'Created ' + name;
            evt.error = !ret.result;
            if (ret.result) {
                evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/' + ret.retobj;
                evt.details = "check transaction";
            } else {
                evt.details = ret.retobj;
            }
            this.myEvents.unshift(evt);
            this.switchMineTab();
        },
        pushClaimEvent: function(ret) {
            this.waiting = false;
            let evt = {};
            evt.name = 'ClaimedReward';
            evt.error = !ret.result;
            if (ret.result) {
                evt.details = "check transaction";
                evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/' + ret.retobj;
            } else {
                evt.details = ret.retobj;
            }
            this.myEvents.unshift(evt);
            this.switchMineTab();
        },
        pushBonusCheckEvent: function(ret) {
            this.waiting = false;
            let evt = {};
            evt.name = 'Bonus checked';
            evt.error = !ret.result;
            if (ret.result) {
                evt.details = "check transaction";
                evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/' + ret.retobj;
            } else {
                evt.details = ret.retobj;
            }
            this.myEvents.unshift(evt);
            this.switchMineTab();
        },
        pushBetEvent: function(amount, btype, ret) {
            this.waiting = false;
            let evt = {};
            evt.name = 'New bet ' + betTypeToStr(btype);
            evt.param2 = amount;
            evt.error = !ret.result;
            if (ret.result) {
                evt.details = "check transaction";
                evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/' + ret.retobj;
            } else {
                evt.details = ret.retobj;
            }
            this.myEvents.unshift(evt);
            this.switchMineTab();
        },
        pushVoteEvent: function(name, amount, ret) {
            this.waiting = false;
            let evt = {};
            evt.name = 'Voted ' + name;
            evt.param2 = amount;
            evt.error = !ret.result;
            if (ret.result) {
                evt.details = "check transaction";
                evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/' + ret.retobj;
            } else {
                evt.details = ret.retobj;
            }
            this.myEvents.unshift(evt);
            this.switchMineTab();
        },
        pushUnVoteEvent: function(name, amount, ret) {
            this.waiting = false;
            let evt = {};
            evt.name = 'UnVoted ' + name;
            evt.param2 = amount;
            evt.error = !ret.result;
            if (ret.result) {
                evt.details = "check transaction";
                evt.tranUrl = 'https://dappchain.tronscan.io/#/transaction/' + ret.retobj;
            } else {
                evt.details = ret.retobj;
            }
            this.myEvents.unshift(evt);
            this.switchMineTab();
        },
        updateEventResult: function(evt) {
            if (evt.type == 2) //vote
            {
                evt.name = 'Voted ' + itemName(evt.itemId) + ' ';
                let itemid = evt.itemId;
                let total = evt.total;
                evt.param2 = evt.amount;
                updateItemVote(itemid, total, true);
                this.events.unshift(evt);
                if (this.events.length > EVENTCNT)
                    this.events.pop();
            } else if (evt.type == 3) //'UnVoted')
            {
                evt.name = "Unvoted " + itemName(evt.itemId) + ' ';
                let itemid = evt.itemId;
                let total = evt.total;
                evt.param2 = evt.amount;
                updateItemVote(itemid, total, false);
                this.events.unshift(evt);
                if (this.events.length > EVENTCNT)
                    this.events.pop();
            } else if (evt.type == 1) //'Created')
            {
                evt.name = 'Created ';
                evt.param2 = evt.itemId;
                let itemId = Number(evt.itemId);
                let total = evt.total;
                if (presetranks.length <= itemId || presetranks[itemId] == null) {
                    readItem(itemId);
                }
                this.events.unshift(evt);
                if (this.events.length > EVENTCNT)
                    this.events.pop();
            } else if (evt.type == 4) {
                evt.param2 = evt.amount;
                evt.name = 'RewardClaimed'
                this.events.unshift(evt);
                if (this.events.length > EVENTCNT)
                    this.events.pop();
            }

        }
    }
})
votemodalv.alleventv = alleventv;
vue_signdays.alleventv = alleventv;
var createmodalv = new Vue({
    el: '#createModal',
    data: {
        costOfCreate: 1000000,
        trxBalance: 0,
        itemName: '',
        indicator: 'Cost 1TRX to create new item',
        cateId: 1,
        cateSelected: 1,
        cates: [{
            id: 1,
            name: 'Country/Region'
        }, {
            id: 2,
            name: 'Person'
        }, {
            id: 3,
            name: 'City'
        }, {
            id: 4,
            name: 'Resort'
        }, {
            id: 5,
            name: 'Brand'
        }, {
            id: 6,
            name: 'Crypto'
        }, {
            id: 7,
            name: 'Star'
        }]
    },
    methods: {
        confirmCreate: function(e) {
            tongjiv.creating = true;
            tongjiv.createResult = false;
            //tongjiv.createtext = "wating tronlink to sign";
            alleventv.pushWaitingEvent("Creating");
            contractCreateVoteItem(null, this.cateSelected, this.itemName, this.costOfCreate, function(ret) {
                tongjiv.creating = false;
                console.log(ret);
                alleventv.pushCreateEvent(createmodalv.itemName, ret);
                tongjiv.createResult = ret.result;
                if (ret.result) {

                    tongjiv.createTran = 'https://dappchain.tronscan.io/#/transaction/' + ret.retobj;
                    //tongjiv.createtext="New item created";
                } else {
                    tongjiv.createtext = "Error:" + ret.retobj.error;
                }
            });
            createModalObj.hide();
        }
    }
});

Vue.component('rankitem', {
    props: ['rank', 'rkitem', 'rkid', 'voting', 'unvoting', 'gsbase', 'cid'],
    template: '<div class="row align-items-center" :id="\'p_rank_\'+rkid"><div class="border-bottom col-2 rankh">{{rank}}</div><div class="border-bottom col-4 rankh" :id="\'rank_\'+rkid" :ttitle="rkitem.creator"><a :href="\'#item=\'+rkid">{{rkitem.name}}</a></div><div class="border-bottom col-2 rankh">{{rkitem.votes}}</div><div class="text-center border-bottom col-4 rankh"><div class="btn-group"><button type="button" :itemid="rkid" onclick="voteItem(this)" class="btn btn-sm btn-outline-primary" v-bind:class="{disabled: voting}"><span v-if="voting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Vote</button><button type="button" :itemid="rkid" onclick="unVoteItem(this)" class="btn btn-sm btn-outline-danger" v-bind:class="{disabled: unvoting}">UnVote<span v-if="unvoting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></button></div></div></div>'
});

var tongjiv = new Vue({
    el: '#v_tongji',
    data: {
        show: true,
        costOfCreate: 1000000,
        totalusers: 0,
        totalevents: 0,
        exrate: 100,
        airdropusers: 0,
        totalvotes: 0,
        totalrewards: 0,
        totalitems: 0,
        myvotes: 0,
        claiming: false,
        claimResult: false,
        creating: false,
        createtext: '',
        createResult: false,
        claimtext: '',
        claimTran: '',
        createTran: '',
        loading: true,
    },
    computed: {
        estimateReward: function() {
            if (this.totalvotes > 0) {
                return Number(115200 / this.totalvotes).toFixed(6);
            } else
                return 0;
        }
    },
    methods: {
        tjClaimReward: function(evt) {
            tongjiv.claimResult = false;
            //tongjiv.claiming = true;				
            claimReward(function(ret) {

                tongjiv.claiming = false;
                tongjiv.claimResult = ret.result;
                alleventv.pushClaimEvent(ret);
                if (ret.result) {
                    console.log(ret);
                    console.log(ret.retobj);
                    tongjiv.claimTran = 'https://dappchain.tronscan.io/#/transaction/' + ret.retobj;
                    tongjiv.claimtext = 'claimed successfully';
                } else {
                    console.log(ret);
                    console.log(ret.retobj);

                    tongjiv.claimtext = ret.retobj.error;
                }
            });
        },
        tjCreateNew: function(evt) {

            createNew();
        },
    }
})

function btnClaimReward() {
    tongjiv.tjClaimReward();
}

function itemName(itemId) {
    if (itemId < presetranks.length && presetranks[itemId])
        return presetranks[itemId].name;
    else
        return String(itemId);
}

function getUrl(id, cid) {
    return encodeURI('showitem.html?id=' + key + '&cate=' + cid);
}
var rankv = new Vue({
    el: '#v_ranks',
    data: {
        show: true,
        gbase: 'showitem.html?id=',
        cateId: 1,
        curPage: 1,
        pageSize: 50,
        itemsVoting: new Map(),
        allItems: [],
        items: [], //pageitem
        itemsMap: new Map(),
    },
    computed: {
        hasPrePage: function() {
            return this.curPage > 1;
        },
        hasNextPage: function() {

            return this.curPage * this.pageSize < this.allItems.length;
        },
        cateName: function() {
            return cateNames[this.cateId];
        }

    },
    methods: {
        switchCateId: function(cateId) {
            this.cateId = cateId;
            this.allItems.length = 0;
            this.itemsMap.clear();
            this.items.splice(0, this.pageSize);
            this.curPage = 1;
        },
        setCurPage: function() {
            this.items.length = 0;
            for (let i = (this.curPage - 1) * this.pageSize, j = 0; j < this.pageSize && i < this.allItems.length; i++, j++) {
                this.items.push(this.allItems[i]);
            }

        },
        nextPage: function() {
            if (!this.hasNextPage)
                return;
            this.items.length = 0;
            for (let i = this.curPage * this.pageSize, j = 0; j < this.pageSize && i < this.allItems.length; i++, j++) {
                this.items.push(this.allItems[i]);
            }
            this.curPage++;
        },
        previousPage: function() {
            if (!this.hasPrePage)
                return;

            for (let i = (this.curPage - 2) * this.pageSize, j = 0; j < this.pageSize && i < this.allItems.length; i++, j++) {
                this.items[j] = this.allItems[i];
            }
            this.curPage--;
        },
        isVoting: function(itemId) {
            return this.itemsMap.has(itemId);
        },
        setVoting: function(itemId, flag) {
            this.itemsMap.set(itemId, flag);
        }
    }
})
var voteitModalv = new Vue({
    el: '#voteitModal',
    data: {
        airdroping: false,
        buying: false,
        inputTrxInSun: null,
    },
    methods: {
        buyToken: function() {
            if (this.inputTrxInSun > 0) {
                alleventv.pushWaitingEvent("Buy...");
                this.buying = true;
                contractBuy(null, this.inputTrxInSun, function(ret) {
                    voteitModalv.buying = false;
                    alleventv.pushBuyEvent(voteitModalv.inputTrxInSun, ret);
                    voteitModalObj.hide();
                })
            }
        },
        airDropToken: function() {
            alleventv.pushWaitingEvent("Airdrop");
            this.airdroping = true;
            contractAirdrop(null, function(ret) {
                voteitModalv.airdroping = false;
                alleventv.pushAirdropEvent(ret);
                voteitModalObj.hide();
            });
        }
    }

});
vue_dex = new Vue({
    el: '#voteitdex',
    data: {
        show: false,
        buying: false,
        selling: false,
        lastPrice: 0,
        totalAmount: 0, //deal amount
        totalOrders: 0,
        trxBalance: 0,
        tokenBalance: 0,
        sellAmount: 0,
        buyAmount: 0,
        buyPrice: 0,
        sellPrice: 0,
        ordersMap: {},
        sordersMap: {},
        sellorders: [{
            price: null,
            dprice: '-',
            amount: null
        }, {
            price: null,
            dprice: '-',
            amount: null
        }, {
            price: null,
            dprice: '-',
            amount: null
        }, {
            price: null,
            dprice: '-',
            amount: null
        }, {
            price: null,
            dprice: '-',
            amount: null
        }],
        buyorders: [{
            price: null,
            dprice: '-',
            amount: null
        }, {
            price: null,
            dprice: '-',
            amount: null
        }, {
            price: null,
            dprice: '-',
            amount: null
        }, {
            price: null,
            dprice: '-',
            amount: null
        }, {
            price: null,
            dprice: '-',
            amount: null
        }],
        tradehistories: [],
        indicator: ''
    },
    methods: {
        buyVoteit: function() {
            if (Number(this.buyPrice) < 0.000001) {
                this.inidicator = 'minum price is 0.000001';
                return;
            }
            //let trxNeed = this.buyPrice*this.buyAmount;
            if (Number(this.buyPrice) * Number(this.buyAmount) > this.trxBalance) {
                this.inidicator = "TRX is not sufficient";
                return;
            }
            this.buying = true;
            alleventv.pushWaitingEvent("Buy Voteit...");
            dexBuyVoteit(tronlinkConnected, Number(this.buyPrice), Number(this.buyAmount), function(ret) {
                vue_dex.buying = false;
                alleventv.pushBuyVoteit(vue_dex.buyAmount, ret);
                console.log(ret);
            })
        },
        sellVoteit: function() {
            if (Number(this.sellPrice) < 0.000001) {
                this.inidicator = 'minum price is 0.000001';
                return;

            }
            //let trxNeed = this.buyPrice*this.buyAmount;
            if (Number(this.sellAmount) > Number(this.tokenBalance)) {
                this.inidicator = "VOTEIT is not sufficient";
                return;
            }
            this.selling = true;
            alleventv.pushWaitingEvent("Sell Voteit...");
            dexSellVoteit(tronlinkConnected, Number(this.sellPrice), Number(this.sellAmount), function(ret) {
                vue_dex.selling = false;
                alleventv.pushSellVoteit(vue_dex.sellAmount, ret);
                console.log(ret);
            })
        }
    }
})
let betcontract = "TXPV4HTikmAzA1SDbGPKrs652KFzy1wnDp";

async function readBetMetrics() {
    if (localTronweb) {
        try {
            let contract = await localTronweb.contract().at(betcontract);
            let tAmount = betAmount * 1000000;
            let ret = await contract.batchBid(betType, tAmount, batchcnt).send({
                feeLimit: 100_000_000,
                callValue: 0,
                tokenId: contractTokenId,
                tokenValue: tAmount * batchcnt,
                shouldPollResponse: false
            });
            console.log(ret);
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (error) {
            if (callback) {
                callback({
                    result: false,
                    retobj: error
                });
            }
        }
    }
}
async function contractBet(betType, betAmount, batchcnt, callback) {
    if (!tronlinkWeb) {
        tronlinkNotConnected();
    } else {
        try {
            let contract = await tronlinkWeb.contract().at(betcontract);
            let tAmount = betAmount * 1000000;
            let ret = await contract.batchBid(betType, tAmount, batchcnt).send({
                feeLimit: 100_000_000,
                callValue: 0,
                tokenId: contractTokenId,
                tokenValue: tAmount * batchcnt,
                shouldPollResponse: false
            });
            console.log(ret);
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (error) {
            if (callback) {
                callback({
                    result: false,
                    retobj: error
                });
            }
        }
    }

}
async function contractGetBetDetail(bidx, callback) {
    if (tronlinkWeb) {
        try {
            let contract = await tronlinkWeb.contract().at(betcontract);
            let addr = tronlinkWeb.defaultAddress.base58;
            let ret = await contract.getBetDetail(bidx).call({
                feeLimit: 100_000_000,
                callValue: 0,
                tokenId: '',
                tokenValue: 0,
                shouldPollResponse: false
            });
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (error) {
            if (callback) {
                callback({
                    result: false,
                    retobj: error
                });
            }
        }
    }
}
async function contractGetMyBets(callback) {
    if (tronlinkWeb) {
        try {
            let contract = await tronlinkWeb.contract().at(betcontract);
            let addr = tronlinkWeb.defaultAddress.base58;
            let ret = await contract.getUserActiveBets(addr).call({
                feeLimit: 100_000_000,
                callValue: 0,
                tokenId: '',
                tokenValue: 0,
                shouldPollResponse: false
            });
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (error) {
            if (callback) {
                callback({
                    result: false,
                    retobj: error
                });
            }
        }
    }
}

async function contractSettleBets(callback) {
    if (!tronlinkWeb) {
        tronlinkNotConnected();
    } else {
        try {
            let contract = await tronlinkWeb.contract().at(betcontract);
            let ret = await contract.settleUserBets().send({
                feeLimit: 100_000_000,
                callValue: 0,
                tokenId: '',
                tokenValue: 0,
                shouldPollResponse: false
            });
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (error) {
            if (callback) {
                callback({
                    result: false,
                    retobj: error
                });
            }
        }
    }

}
let vue_betgame = new Vue({
    el: "#v_betgame",
    data: {
        blockNumber: 0,
        blockID: "",
        result: "",
        pastBN: [{
            bn: 0,
            bid: "-",
            result: ""
        }, {
            bn: 0,
            bid: "-",
            result: ""
        }, {
            bn: 0,
            bid: "-",
            result: ""
        }, {
            bn: 0,
            bid: "-",
            result: ""
        }, {
            bn: 0,
            bid: "-",
            result: ""
        }, {
            bn: 0,
            bid: "-",
            result: ""
        }],
        myBets: [],
        betTypes: [{
            id: 1,
            name: 'ODD'
        }, {
            id: 2,
            name: 'EVEN'
        }, {
            id: 4,
            name: 'TWIN-D'
        }, {
            id: 8,
            name: 'TRI-D'
        }, {
            id: 16,
            name: 'QUA-D'
        }, {
            id: 32,
            name: 'FIVE-D'
        }],
        betTypeSelected: 1,
        batchCount: 1,
        betting: false,
        checking: false,
        betAmount: 0,
        betType: 0,
        totalBet: 0,
        totalAmount: 0,
        totalWin: 0,
        tokenBalance: 0,
        maxMyBetBn: 0,
        bonusReady: false,
        bonusBlinkObj: null,
        isRefreshing: false,
        bnResults: {},
        betResult: 'You need bet first',
        refreshBn: 0
    },
    computed: {
        indicate: function() {
            if (Number(this.batchCount) < 1 || Number(this.batchCount) > 5) {
                return "Batch: 1 to 5";
            } else if (Number(this.betAmount) < 0) {
                return "Amount should > 0";
            } else {
                switch (this.betTypeSelected) {
                    case 2:
                    case 1:
                        return "bet 1 win 2";
                    case 4:
                        return "bet 1 win 16";
                    case 8:
                        return "bet 1 win 256";
                    case 16:
                        return "bet 1 win 4096";
                    case 32:
                        return "bet 1 win 65536";
                        return "pls select type";
                }
            }
            return "";
        }
    },
    methods: {
        resultStr: function(re) {
            return result2str(re);
        },
        confirmCheckBonus: function() {
            if (!getRealTronweb()) {
                tronlinkNotConnected();
            } else {
                this.checking = true;
                alleventv.pushWaitingEvent("Check bonus..");
                contractSettleBets(function(ret) {
                    vue_betgame.checking = false;
                    alleventv.pushBonusCheckEvent(ret);
                    vue_betgame.refreshMyBets();
                })
            }
        },
        confirmBet: function() {
            if (!getRealTronweb()) {
                tronlinkNotConnected();
            } else {
                if (this.betAmount > 0) {
                    this.betting = true;
                    alleventv.pushWaitingEvent("New Bet..");
                    contractBet(this.betTypeSelected, this.betAmount, this.batchCount, function(ret) {
                        vue_betgame.betting = false;
                        alleventv.pushBetEvent(vue_betgame.betAmount, vue_betgame.betTypeSelected, ret);
                        vue_betgame.refreshMyBets();
                    })
                }
            }
        },
        addMyBet: function(bet) {
            if (!bet)
                return false;
            let betBn = big2number(bet.betBN);
            if (this.blockNumber == 0 || this.blockNumber > (256 + betBn))
                return false;
            for (let i = 0; i < this.myBets.length; i++) {
                if (this.myBets[i].bn == betBn) {
                    return false;
                }
            }
            if (betBn > this.maxMyBetBn) {
                this.maxMyBetBn = betBn;
            }
            this.myBets.unshift({
                bn: betBn,
                amount: big2number(bet.betAmount),
                btype: big2number(bet.betType),
                btypeStr: betTypeToStr(big2number(bet.betType)),
                result: 0,
                win: false
            });
            return betBn;
        },
        updateMyBets: function(curBN) {
            this.myBets.sort(function(a, b) {
                return b.bn - a.bn
            });
            let len = this.myBets.length;
            for (let i = len - 1; i >= 0; i--) {
                if ((this.myBets[i].bn + 256) < curBN) {
                    this.myBets.pop();
                } else {
                    if (this.myBets[i].result == 0) {
                        if (this.bnResults[this.myBets[i].bn] > 0) {
                            this.myBets[i].result = this.bnResults[this.myBets[i].bn];
                            if ((this.myBets[i].btype & this.myBets[i].result) == this.myBets[i].btype) {
                                this.myBets[i].win = true;
                            }
                        } else if (this.myBets[i].bn < curBN) {
                            let bn = this.myBets[i].bn;
                            getBlock(bn, function(bh) {
                                vue_betgame.setBetResult(bn, getBlockResult(bh));
                            })
                        }
                    }
                }
            }
            let wins = 0;
            for (let i = 0; i < len; i++) {
                if (this.myBets[i].result == 0) {
                    this.betResult = "Waiting block..."
                    return;
                } else {
                    if (this.myBets[i].win) {
                        wins++;
                    }
                }
            }
            this.betResult = "Win " + wins + " of " + len;
            if (curBN >= this.maxMyBetBn) {
                if (!this.bonusBlinkObj && wins > 0) {
                    this.bonusBlinkObj = setInterval(async () => {
                        let e = document.getElementById("btnClaimBonus");
                        if (vue_betgame.bonusReady) {
                            e.classList.add("border");
                            e.classList.add("border-4");
                            e.classList.add("border-warning");
                        } else {
                            e.classList.remove("border");
                            e.classList.remove("border-4");
                            e.classList.remove("border-warning");
                        }
                        vue_betgame.bonusReady = !vue_betgame.bonusReady;
                    }, 500);
                }
            }

        },
        refreshMyBets: function() {
            this.isRefreshing = true;
            contractGetMyBets(function(ret) {
                vue_betgame.isRefreshing = false;
                if (!ret.result)
                    return;
                let obj = ret.retobj;
                let i = 0;
                if (obj.length == 0) {
                    vue_betgame.myBets = [];
                }
                for (; i < obj.length; i++) {
                    contractGetBetDetail(big2number(obj[i]), function(ret1) {
                        if (ret1.result) {
                            let bn = vue_betgame.addMyBet(ret1.retobj);
                            if (bn < vue_betgame.blockNumber) {

                            }
                        }
                    })
                }

                if (obj.length == 0) {
                    clearInterval(vue_betgame.bonusBlinkObj);
                    vue_betgame.bonusBlinkObj = null;
                    let e = document.getElementById("btnClaimBonus"); {
                        e.classList.remove("border");
                        e.classList.remove("border-4");
                        e.classList.remove("border-warning");
                    }
                }
            });
        },
        setBetResult: function(bn, result) {
            this.bnResults[bn] = result;
            let len = this.myBets.length;
            for (let i = len - 1; i >= 0; i--) {
                if (this.myBets[i].bn == bn) {
                    this.myBets[i].result = result;
                    if ((this.myBets[i].btype & result) == this.myBets[i].btype) {
                        this.myBets[i].win = true;
                    }
                    break;
                }
            }
        }

    }
});

function betTypeToStr(btype) {
    for (let i = 0; i < vue_betgame.betTypes.length; i++) {
        if (btype == vue_betgame.betTypes[i].id)
            return vue_betgame.betTypes[i].name;
    }
    return '';
}

function result2str(result) {
    let str = "";
    if ((result & 1) == 1) {
        str += "ODD";
    } else if ((result & 2) == 2) {
        str += "EVEN";
    }
    if ((result & 4) == 4) {
        str += ",TWIN-D";
    } else if ((result & 8) == 8) {
        str += ",TRI-D";
    } else if ((result & 16) == 16) {
        str += ",QUA-D";
    } else if ((result & 32) == 32) {
        str += ",FIVE-D";
    }
    return str;
}

function getBlockResult(bid) {
    let result = 0;
    let last5bid = bid.slice(-5);
    let lastDigit = new bigInt(last5bid.slice(-1), 16).toJSNumber();
    if ((lastDigit & 1) == 1) {
        result += 1;
    } else {
        result += 2;
    }
    if (last5bid[4] == last5bid[3]) {
        result += 4;
        if (last5bid[2] == last5bid[3]) {
            result += 8;
            if (last5bid[2] == last5bid[1]) {
                result += 16;
                if (last5bid[0] == last5bid[1]) {
                    result += 32;
                }
            }
        }
    }
    return result;

}
var maxOrderId = 0;
setInterval(async () => {
    if (view_type == VIEW_DEX) {
        dexRead('getMetrics', function(metrics) {
            if (metrics.result) {
                let morderId = big2number(metrics.retobj.totalOrders);
                vue_dex.totalOrders = morderId;
                vue_dex.lastPrice = big2number(metrics.retobj.lastPrice);
                vue_dex.totalAmount = big2number(metrics.retobj.totalAmount);
                if (morderId > maxOrderId) {
                    readBuyPrices();
                    readSellPrices();
                    readUserOrders();
                    maxOrderId = morderId;
                }
            }
        });
    }
    if (view_type == VIEW_BET || view_type == VIEW_PET) {
        getCurrentBlock(function(bn, bid) {
            if (true) {
                vue_betgame.blockNumber = bn;
                vue_betgame.blockID = bid;
                vue_betgame.result = getBlockResult(bid);
                vue_pets.setGemResult(bn, vue_betgame.result);
                //update bn and id;
                let startbn = bn - 6;
                let endbn = bn - 1;
                vue_betgame.setBetResult(bn, vue_betgame.result);

                /*
                getBlockRange(startbn, endbn, function(blocks){
                    console.log(blocks);
                      for(let i=0;i<blocks.length;i++){
                         vue_betgame.pastBN[i].bn = (startbn+i);
                         vue_betgame.pastBN[i].bid = blocks[i]['blockID'].slice(-5);
                         vue_betgame.pastBN[i].result = getBlockResult(vue_betgame.pastBN[i].bid);
                         vue_betgame.setBetResult(vue_betgame.pastBN[i].bn, vue_betgame.pastBN[i].result);
                      }
                    })
                */
                vue_betgame.updateMyBets(bn);

                if ((bn - vue_betgame.refreshBn) >= 3) {
                    vue_betgame.refreshBn = bn;
                    vue_betgame.refreshMyBets();
                    vue_pets.refreshSearches();
                }
            }
        });

        if (view_type == VIEW_PET) {
            readPetMetrics();
            getUserMetrics(function(ret) {
                if (ret.result) {
                    vue_pets.myGemsCnt = big2number(ret.retobj.gemCnt);
                    vue_pets.myPetsCnt = big2number(ret.retobj.petCnt);
                    vue_pets.nextPickPrice = big2number(ret.retobj.pickPrice)/DECIMALS;
                }

            });

        }
    }
    vue_dex.trxBalance = walletv.trxBalance;
    vue_dex.tokenBalance = walletv.tokenBalance;
    vue_betgame.tokenBalance = walletv.tokenBalance;
    vue_pets.tokenBalance = walletv.tokenBalance;
}, 3000);
readBuyPrices();
readSellPrices();

//rawPet has unique ID from 1
//marketPet has unique ID from 1
//foods  has unique ID from 1
let petPriceModalObj = null;//new bootstrap.Modal(document.getElementById('petModal'), null);

vue_pets = new Vue({
    el: "#v_pets",
    data: {
        searches: [],
        rawPets: [],
        marketGems: [],
        myPets: [],
        myGems: [],
        //{petId:1,desc:"A cute cate", price:0, img:"kitty1.svg"},{petId:2,desc:"A cute cate", price:1,img:"kitty1.svg"}
        marketPets: [],
        rankingPets: [{
            desc: "A cute cate",
            price: 0,
            img: "kitty1.svg",
            saph: 0,
            ruby: 0,
            diam: 0,
            power: 0
        }],
        sellPrice:0,
        itemName:'',
        sellIndicator:'',
        totalRawPets: 125,
        totalPets: 0,
        totalGems: 0,
        petsCntBp: 0,
        myPetsCnt: 0,
        myGemsCnt: 0,
        nextPickPrice: 10,
        totalMarketPets: 0,
        totalMarketGems: 0,
        tokenBalance: 0,
        totalEvents: 0,
        searchPrice: 5,
        searchTimes: 5,
        feedPrice: 5,
        bnGems: {},
        block: 0,
        findGems: 0,
        searching: false,
        claiming: false,
        maxBn: 0
    },
    methods: {
        //pick pets randomly
        addNewSearch: function(se) {
            for (let i = 0; i < this.searches.length; i++) {
                if (this.searches[i].betbn == se.betbn) {
                    return;
                }
            }
            if (se.betbn > this.maxBn) {
                this.maxBn = se.betbn;
            }
            this.searches.push(se);
        },
        refreshSearches: function() {
            //this.searches=[];
            if (tronlinkWeb) {
                let addr = tronlinkWeb.defaultAddress.base58;
                petContractRead('getUserActiveSearch', function(ret) {
                    if (ret.result) {
                        let sobj = ret.retobj;
                        if (sobj.length == 0) {
                            vue_pets.searches = [];
                        }
                        for (let i = 0; i < sobj.length; i++) {
                            let sidx = big2number(sobj[i]);
                            petContractRead('getSearchDetail', function(ret1) {
                                if (ret1.result) {
                                    let se = {};
                                    se.betbn = big2number(ret1.retobj.betBN);
                                    se.result = 0;
                                    vue_pets.addNewSearch(se);
                                }
                            }, sidx);
                        }
                    }
                }, addr);
            }

        },
        setGemResult: function(bn, result) {
            this.block = bn;
            if ((result & 4) == 4) {
                this.bnGems[bn] = 4; //it is gem.
            } else
                this.bnGems[bn] = 1;
            let gemcnt = 0;
            for (let i = 0; i < this.searches.length; i++) {
                if (this.searches[i].betbn == bn) {
                    this.searches[i].result = this.bnGems[bn];
                }
                if (this.searches[i].result == 4) {
                    gemcnt++;
                }
                if (bn > this.searches[i].betbn && this.searches[i].result == 0) {
                    let oldbn = this.searches[i].betbn;
                    if ((oldbn + 255) > bn) {
                        getBlock(oldbn, function(bh) {
                            vue_pets.setGemResult(bn, getBlockResult(bh));
                        });
                    } else {
                        this.searches[i].result = 1;
                    }
                }
            }
            this.findGems = gemcnt;

        },
        buildRawPets: function() {
            if (this.rawPets.length == 0) {
                for (let i = 1; i <= this.totalRawPets; i++) {
                    this.rawPets.push({
                        desc: 'A cute pet',
                        img: 'pet' + i + '.png',
                        hot: 0
                    });
                }
            }
        },
        updateMarketGem: function(gem) {
            let find = false;
            for (let i = 0; i < this.marketGems.length; i++) {
                if (this.marketGems[i].gemId == gem.gemId) {
                    find = true;
                    this.marketGems[i].owner = gem.owner;
                    this.marketGems[i].price = gem.price / DECIMALS;
                }
            }
            if (!find) {
                this.marketGems.push(gem);
            }
        },
        updateMyPet: function(pet) {
            let find = false;
            for (let i = 0; i < this.myPets.length; i++) {
                if (this.myPets[i].petId == pet.petId) {
                    find = true;
                    this.myPets[i].power = pet.power;
                    this.myPets[i].price = pet.price / DECIMALS;
                }
            }
            if (!find) {
                this.myPets.push(pet);
            }
        },
        updateMyGem: function(gem) {
            let find = false;
            for (let i = 0; i < this.myGems.length; i++) {
                if (this.myGems[i].gemId == gem.gemId) {
                    find = true;
                    this.myGems[i].power = gem.power;
                }
            }
            if (!find) {
                this.myGems.push(gem);
            }
        },
        updateMarketPet: function(pet) {
            let find = false;
            for (let i = 0; i < this.marketPets.length; i++) {
                if (this.marketPets[i].petId == pet.petId) {
                    find = true;
                    this.marketPets[i].power = pet.power;
                    this.marketPets[i].price = pet.price / DECIMALS;
                }
            }
            if (!find) {
                this.marketPets.push(pet);
            }

        },
        pick: function() {
            if (!tronlinkWeb) {
                tronlinkNotConnected();
            } else if (this.nextPickPrice > 0) {
                alleventv.pushWaitingEvent("Picking pet");
                this.petsCntBp = this.myPetsCnt;
                pickPet(this.nextPickPrice, function(ret) {
                    //picked //push allevent;
                    alleventv.pushPickPet(ret);
                })
            }
        },
        buy: function(petId, price) {
            if (!tronlinkWeb) {
                tronlinkNotConnected();
            } else {
                buyPet(petId, price, function(ret) {

                });
            }
            console.log(petId);

        },
        confirmSell:function()
        {
           if(this.sellPrice > 0)
           {
              if(this.sellObj.type == 1)
              {
	         //sellPet;
                 let petId = this.sellObj.id;
	         alleventv.pushWaitingEvent("Selling Pet..");
                 sellPet(petId, this.sellPrice, function(ret){
                        alleventv.pushSellPetGem("Pet",petId, ret);
			});
	      }
	      else
              {
                 //sellGem
                 let gemId= this.sellObj.id;
	         alleventv.pushWaitingEvent("Selling Gem ..");
                 contractSellGem(gemId, this.sellPrice, function(ret){
                        alleventv.pushSellPetGem("Gem",gemId, ret);
			});
	      }
             
             petPriceModalObj.hide();
           } 
           else
           {
	       this.sellIndicator='Sell price must >0';
           }
        },
        sell: function(petId) {
            this.itemName="Pet "+petId;
            this.sellObj = {type:1, id:petId};
            petPriceModalObj = new bootstrap.Modal(document.getElementById('petPriceModal'), null);
            petPriceModalObj.show();
        },
        release: function(petId) {
            console.log(petId);
        },
        feed: function(petId) {
            if (!tronlinkWeb) {
                tronlinkNotConnected();
            } else {
                alleventv.pushWaitingEvent('Feeding pet'); 
                feedPet(petId, function(ret) {
                    alleventv.pushFeedPet(petId, ret);
                })
            }
        },
        searchGem: function() {
            if (!tronlinkWeb) {
                tronlinkNotConnected();
            } else {
                vue_pets.searching = true;
                petContractWritePay('searchGem', function(ret) {
                    if (ret.result) {
                        vue_pets.searching = false;

                    }
                }, this.searchPrice * this.searchTimes, this.searchTimes);
            }
        },
        claimGem: function() {
            if (!tronlinkWeb) {
                tronlinkNotConnected();
            } else {
                vue_pets.claiming = true;
                petContractWrite('claimGems', function(ret) {
                    if (ret.result) {
                        vue_pets.claiming = false;

                    }
                });
            }
        },
        buyGem: function(gemId) {

        },
        sellGem: function(gemId) {
            this.itemName="Gem " + gemId;
            this.sellObj = {type:2, id:petId};
            petPriceModalObj.show();
        },
        bindGem: function(gemId) {

        },
        sellOrUnsell:function(type,petId)
        {
            if(type == 1)
            {
               for(let i=0;i<this.myPets.length;i++)
               {
                  if(this.myPets[i].petId == petId)
                  {
                     if(this.myPets[i].price == 0)
                         return 'Sell';
                     else
                         return 'Unsell';
		  }
               }
            }
	    else
            {
               for(let i=0;i<this.myGems.length;i++)
               {
                  if(this.myGems[i].gemId == petId)
                  {
                     if(this.myGems[i].price == 0)
                         return 'Sell';
                     else
                         return 'Unsell';
                 }
               }
	    }
        },
        showMyPetGem: function() {
            if (!tronlinkWeb) {
                return tronlinkNotConnected();
            }
            showEle('petsRanking', false);
            showEle('petsPick', false);
            showEle('petsMarket', false);
            showEle('myPetGem', true);

            getMyPets(function(ret) {
                if (ret.result) {
                    let pobj = ret.retobj;
                    for (let i = 0; i < pobj.length; i++) {
                        let petId = big2number(pobj[i]);
                        getPetBasic(petId, function(ret1) {
                            if (ret1.result) {
                                let mpet = {};
                                mpet.petId = petId;
                                mpet.rpId = big2number(ret1.retobj.rpId);
                                mpet.power = big2number(ret1.retobj.power);
                                mpet.price = big2number(ret1.retobj.price) / DECIMALS;
                                mpet.img = 'pet' + mpet.rpId + '.png';
                                vue_pets.updateMyPet(mpet);
                            }
                        });
                    }
                }
            });
            let addr = tronlinkWeb.defaultAddress.base58;
            petContractRead('getUserGems',
                function(ret) {
                    if (ret.result) {
                        let gobj = ret.retobj;
                        for (let i = 0; i < gobj.length; i++) {
                            let gemId = big2number(gobj[i]);
                            petContractRead('getGem', function(ret1) {
                                if (ret1.result) {
                                    let gemobj = ret1.retobj;
                                    let gem = {};
                                    gem.gemId = gemId;
                                    gem.gemType = gemobj.gemType;
                                    gem.img = gemType2Img(gem.gemType);
                                    gem.price = big2number(gemobj.price);
                                    gem.owner = gemobj.gemowner;
                                    gem.petId = big2number(gemobj.petId);
                                    vue_pets.updateMyGem(gem);
                                }
                            }, gemId);
                        }
                    }
                }, addr);
        },

        showPetMarket: function() {
            showEle('petsRanking', false);
            showEle('petsPick', false);
            showEle('petsMarket', true);
            showEle('myPetGem', false);
        },
        showPetPicker: function() {
            showEle('petsRanking', false);
            showEle('petsPick', true);
            showEle('petsMarket', false);
            showEle('myPetGem', false);
            this.buildRawPets();
        },
        showPetRanking: function() {
            showEle('petsRanking', true);
            showEle('petsPick', false);
            showEle('petsMarket', false);
        }

    }
});

function gemType2Img(gt) {
    if (gt == 1) {
        return 'gem.svg';
    } else if (gt == 2) {
        return 'ruby.svg';
    } else if (gt == 3) {
        return 'diamond.svg';
    }

}
petContractRead('getMarketGems', function(ret) {
    if (ret.result) {
        let mgems = ret.retobj;
        for (let i = 0; i < mgems.length; i++) {
            let gemId = big2number(mgems[i]);
            petContractRead('getGem', function(ret1) {
                if (ret1.result) {
                    let gemobj = ret1.retobj;
                    let gem = {};
                    gem.gemId = gemId;
                    gem.gemType = gemobj.gemType;
                    gem.img = gemType2Img(gem.gemType);
                    gem.price = big2number(gemobj.price);
                    gem.owner = gemobj.gemowner;
                    gem.petId = big2number(gemobj.petId);
                    vue_pets.updateMarketGem(gem);
                }

            }, gemId);
        }
    }
})
getMarketPets(function(ret) {
    if (ret.result) {
        let mpets = ret.retobj;
        for (let i = 0; i < mpets.length; i++) {
            let petId = big2number(mpets[i]);
            getPetBasic(petId, function(ret1) {
                if (ret1.result) {
                    let mpet = {};
                    mpet.petId = petId;
                    mpet.rpId = big2number(ret1.retobj.rpId);
                    mpet.power = big2number(ret1.retobj.power);
                    mpet.price = big2number(ret1.retobj.price) / DECIMALS;
                    mpet.img = 'pet' + mpet.rpId + '.png';
                    vue_pets.updateMarketPet(mpet);
                }
            });

        }
    }
})
async function petContractWritePay(mname, callback, value, param, param2) {
    if (value <= 0)
        return;
    if (tronlinkWeb) {
        try {
            let contract = await tronlinkWeb.contract().at(petcontract);
            let obj = {
                feeLimit: 100_000_000,
                callValue: 0,
                tokenId: contractTokenId,
                tokenValue: value * 1000000,
                shouldPollResponse: false
            };
            let ret;
            if (param != undefined && param2 != undefined) {
                ret = await contract[mname](param, param2).send(obj);
            } else if (param != undefined)
                ret = await contract[mname](param).send(obj);
            else
                ret = await contract[mname]().send(obj);
            //console.log(ret);
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
}
async function petContractWrite(mname, callback, param, param2) {
    if (tronlinkWeb) {
        try {
            let contract = await tronlinkWeb.contract().at(petcontract);
            let obj = {
                feeLimit: 100_000_000,
                callValue: 0,
                tokenId: '',
                tokenValue: 0,
                shouldPollResponse: false
            };
            let ret;
            if (param != undefined && param2 != undefined) {
                ret = await contract[mname](param, param2).send(obj);
            } else if (param != undefined)
                ret = await contract[mname](param).send(obj);
            else
                ret = await contract[mname]().send(obj);
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (err) {
            console.log(err);
        }
    }
}
async function petContractRead(mname, callback, param, param2) {
    let optw = localTronweb;
    if (tronlinkWeb)
        optw = tronlinkWeb;
    if (optw) {
        try {
            let contract = await optw.contract().at(petcontract);
            let ret;
            if (param != undefined && param2 != undefined) {
                ret = await contract[mname](param, param2).call();
            } else if (param != undefined)
                ret = await contract[mname](param).call();
            else
                ret = await contract[mname]().call();
            //console.log(ret);
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (err) {
            console.log(err + " " + mname);
        }
    } else {
        console.log("NO tronweb");
    }
}
async function readPetMetrics() {
    return petContractRead('getMetrics', function(ret) {
        if (ret.result) {
            //uint eventCnt, uint searchCnt, uint gemCnt,uint petCnt, uint rawPetCnt,uint marketPetCnt, uint marketGemCnt
            vue_pets.totalEvents = big2number(ret.retobj.eventCnt);
            vue_pets.totalGems = big2number(ret.retobj.gemCnt);
            vue_pets.totalPets = big2number(ret.retobj.petCnt);
            vue_pets.totalMarketGems = big2number(ret.retobj.marketGemCnt);
            vue_pets.totalMarketPets = big2number(ret.retobj.marketPetCnt);

        } else {
            console.log(ret.retobj);
        }
    });
}
//system
//type is :dog, cat...
async function getUserMetrics(callback) {
    if (tronlinkWeb) {
        let addr = tronlinkWeb.defaultAddress.base58;
        return petContractRead('getUserMetrics', callback, addr);
    }
}


//other users
async function getMarketPets(callback) {
    return petContractRead('getMarketPets', callback);

}
async function getMyPets(callback) {
    if (tronlinkWeb) {
        let addr = tronlinkWeb.defaultAddress.base58;
        return petContractRead('getUserPets', callback, addr);
    }
}
//pick pet from raw pets.
async function pickPet(pickPrice, callback) {
    if (tronlinkWeb) {
        return petContractWritePay('pickRandomPet', callback, pickPrice);
    }
}

const FEEDPRICE = 5; //5 voteit for 1 feed
async function feedPet(petId, callback) {
    if (tronlinkWeb) {
        return petContractWritePay('feedPet', callback, FEEDPRICE, petId);
    }
}
async function getPetBasic(petId, callback) {
    if (localTronweb) {
        return petContractRead('getPetBasic', callback, petId);
    }
}
async function getPetMore(petId, callback) {
    if (localTronweb) {
        return petContractRead('getPetMore', callback, petId);
    }
}
//sell pet in market
async function sellPet(petId, price, callback) {
    if (!tronlinkWeb) {
        tronlinkNotConnected();
    } else if (price > 0) {
        petContractWrite('sellPet', callback, petId, price);
    }
}
async function contractSellGem(gemId, price, callback) {
    if (!tronlinkWeb) {
        tronlinkNotConnected();
    } else if (price > 0) {
        petContractWrite('sellGem', callback, gemId, price);
    }
}
async function unsellPet(petId, callback) {
    if (!tronlinkWeb) {
        tronlinkNotConnected();
    } else {
        petContractWrite('unsellPet', callback);
    }
}
//buy pet from market
async function buyPet(petId, price, callback) {
    if (!tronlinkWeb) {
        tronlinkNotConnected();
    } else {
        petContractWritePay('buyPet', callback, price, petId, price);
    }
}


const maxOrders = 5;

function readUserOrders() {
    dexGetOrders(function(ret) {
        if (ret.result) {
            let ods = ret.retobj;
            let i = 0;
            for (; i < ods.length; i++) {
                let oid = big2number(ods[i]);

                dexRead('getOrderDetails', function(odetail) {
                    if (odetail.result) {
                        let ometrics = odetail.retobj;
                        let torder = {
                            'oid': oid
                        };
                        torder.price = big2number(ometrics.price);
                        torder.amount = big2number(ometrics.amount);
                        torder.lamount = big2number(ometrics.leftamout);
                        torder.ts = big2number(ometrics.ts);
                        torder.tsdone = big2number(ometrics.tsdone);
                        torder.type = ometrics.otype;
                        if (torder.lamount > 0) {
                            if (!alleventv.ordersMap[oid]) {
                                alleventv.orders.unshift(torder);
                                alleventv.ordersMap[oid] = alleventv.orders.length;
                                //alleventv.orders.push(order);
                            } else {
                                alleventv.orders[alleventv.ordersMap[oid] - 1] = torder;
                            }

                        } else {
                            let idx = alleventv.ordersMap[oid];
                            if (idx > 0) {
                                alleventv.orders.splice(idx - 1, 1);
                                alleventv.ordersMap[oid] = 0;
                            }
                        }
                    }
                }, oid);
            }
        }
    });
}

function readBuyPrices() {

    dexRead('getBuyPrices', function(bps) {
        if (bps.result) {
            bps = bps.retobj;
            let i = 0;
            for (; i < bps.length; i++) {
                let bo = vue_dex.buyorders[i];
                let price = big2number(bps[i]);
                bo.price = price;
                bo.dprice = bo.price / 1000000;
                //bo.amount = 0;//need update;
                vue_dex.ordersMap[price] = bo;
                dexRead('getBuyAmount', function(bas) {
                    if (bas.result) {
                        vue_dex.ordersMap[price].amount = big2number(bas.retobj);
                    }
                }, price);

            }
            for (; i < maxOrders; i++) {
                vue_dex.buyorders[i].price = null;
                vue_dex.buyorders[i].dprice = '-';
                vue_dex.buyorders[i].amount = null;

            }
        }
    })
}

function readSellPrices() {

    dexRead('getSellPrices', function(sps) {
        if (!sps.result)
            return;
        sps = sps.retobj;
        let i = 0;
        for (; i < sps.length; i++) {
            let so = vue_dex.sellorders[maxOrders - i - 1];
            so.price = big2number(sps[i]);
            so.dprice = so.price / 1000000;
            let price = so.price;
            so.amount = 0; //need update;
            vue_dex.sordersMap[price] = so;
            dexRead('getSellAmount', function(sa) {
                if (sa.result)
                    vue_dex.sordersMap[price].amount = big2number(sa.retobj);
            }, price);
        }
        for (; i < maxOrders; i++) {
            vue_dex.sellorders[maxOrders - i - 1].price = null;
            vue_dex.sellorders[maxOrders - i - 1].dprice = '-';
            vue_dex.sellorders[maxOrders - i - 1].amount = null;
        }
    })
}

function createNew() {
    if (!getRealTronweb()) {
        tronlinkNotConnected();
    } else {
        createmodalv.trxBalance = walletv.trxBalance;
        createmodalv.costOfCreate = tongjiv.costOfCreate;
        createmodalv.cateSelected = defaultCateId;

        createModalObj = new bootstrap.Modal(document.getElementById('createModal'));
        createModalObj.show();
    }
}

function claimReward(callback) {
    if (!getRealTronweb()) {
        tronlinkNotConnected();
    } else {
        tongjiv.claiming = true;
        //tongjiv.claimtext="waiting for tronlink to sign";
        alleventv.pushWaitingEvent("Claiming");
        contractClaimReward(null, callback);
    }


}

function readItem(itemId) {
    contractRead('getItem', function(ret1) {
        let item = {};
        item.id = itemId;
        item.name = ret1[0];
        item.rank = itemId;
        item.voting = false;
        item.votes = big2number(ret1[1]) / DECIMALS;
        if (itemId == 104 || itemId == 105 || itemId == 96)
            item.cateId = 7;
        else
            item.cateId = big2number(ret1[2]);
        item.creator = getLocalTronweb().address.fromHex(ret1[3]);
        let insert = insertIntoRanks(item);
        //console.log(ret1);
        if (insert)
            presetranks[itemId] = item;
    }, itemId, null);

}

function createRanksOfCate(cateId) {
    if (defaultCateId == cateId)
        return;
    let oldCateId = defaultCateId;
    defaultCateId = cateId;
    walletv.cateId = cateId;
    rankv.switchCateId(cateId);

    for (let i = 0; i < presetranks.length; i++) {
        if (presetranks[i] && presetranks[i].cateId == cateId) {
            insertIntoRanks(presetranks[i]);
        }
    }

    contractRead('getCateItemsId', function(ret) {
        for (let i = 0; i < ret.length; i++) {
            let itemId = big2number(ret[i]);
            readItem(itemId);
        }
        //
    }, defaultCateId);
}

function readMetrics() {
    contractRead('getMetrics', function(ret) {

        tongjiv.totalvotes = big2number(ret[0]) / DECIMALS;
        tongjiv.totalrewards = big2number(ret[1]) / DECIMALS;
        tongjiv.totalitems = big2number(ret[2]) - 1;
        presetranks.length = tongjiv.totalitems + 1;
        tongjiv.costOfCreate = big2number(ret[3]);
        tongjiv.createtext = "Cost " + tongjiv.costOfCreate / DECIMALS + " TRX to create new item";
        createmodalv.indicator = tongjiv.createtext;
        tongjiv.myvotes = big2number(ret[4]) / DECIMALS;
        tongjiv.exrate = big2number(ret[5]);
        tongjiv.airdropusers = big2number(ret[6]);
        tongjiv.totalusers = big2number(ret[7]);
        tongjiv.totalevents = big2number(ret[8]);
        if (tongjiv.totalevents > eventStart) {
            //load event;
            let sidx = eventStart;
            for (; sidx < tongjiv.totalevents; sidx++) {
                contractRead('getUpdateEvent', function(ret1) {

                    let evt = {};
                    evt.caller = getLocalTronweb().address.fromHex(ret1[0]);
                    evt.type = big2number(ret1[1]);
                    evt.itemId = big2number(ret1[2]);
                    evt.amount = big2number(ret1[3]) / DECIMALS;
                    evt.total = big2number(ret1[4]) / DECIMALS;
                    evt.param2 = '';
                    evt.details = evt.caller;
                    alleventv.updateEventResult(evt);
                }, sidx)
            }
            eventStart = tongjiv.totalevents;
        }
        tongjiv.loading = false;
    }, null, null, true);
}
readMetrics();
setInterval(async () => {
    readMetrics();
    getResource(contractOwner, function(ret) {
        walletv.energyLeft = ret
    });
}, 5000);
walletv.connectWallet();
routeByHash();

function voteItemOnLink(itemId) {
    console.log("vote item" + itemId);
}

function unVoteItemOnLink(itemId) {
    console.log("unvote item" + itemId);
}

function updateItemVote(itemId, tvotes, up) {
    itemId = Number(itemId);
    if (rankv.itemsMap.has(itemId)) {
        let ov = presetranks[itemId].votes;
        if (up && ov < tvotes) {
            presetranks[itemId].votes = tvotes; //update
            if (ov != tvotes) {
                rankv.allItems.sort(function(a, b) {
                    return b.votes - a.votes
                });
                rankv.setCurPage();
            }
        }
    } else {
        if (presetranks[itemId]) {
            presetranks[itemId].votes = tvotes;
        }
    }
}

function insertIntoRanks(item) {
    if (item.cateId != rankv.cateId)
        return true;
    if (rankv.itemsMap.has(item.id)) {
        let ov = presetranks[item.id].votes;
        presetranks[item.id].votes = item.votes; //update
        if (ov != item.votes) {
            rankv.allItems.sort(function(a, b) {
                return b.votes - a.votes
            });
        } else {
            rankv.setCurPage();
        }
        return false;
    } else {
        rankv.allItems.push(item);
        rankv.allItems.sort(function(a, b) {
            return b.votes - a.votes
        });
        rankv.setCurPage();
        rankv.itemsMap.set(item.id, true);
        return true;
    }
}

function requestVOTEIT() {
    if (!walletv.tlconnected) {
        tronlinkNotConnected();
    } else {
        voteitModalObj = new bootstrap.Modal(document.getElementById('voteitModal'), null);
        voteitModalObj.show();
    }
}

function rankFilter() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("rankFilterInput");
    filter = input.value.toUpperCase();

    for (i = 0; i < rankv.items.length; i++) {
        let e = document.getElementById("rank_" + rankv.items[i].id);
        let pdiv = document.getElementById("p_rank_" + rankv.items[i].id);
        txtValue = e.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            pdiv.style.display = "";
        } else {
            pdiv.style.display = "none";
        }
    }
}

function routeByHash() {
    let urltail = window.location.hash;
    let ic = urltail.indexOf('cate=');
    if (ic != -1) {
        alleventv.mode = 1;
        showEle('v_ranks', true);
        showEle('voteitdex', false);
        showEle('v_itemdetail', false);
        showEle('v_betgame', false);

        vue_itemdetail.show = false;
        createRanksOfCate(Number(urltail.substr(ic + 5)));
    } else {
        ic = urltail.indexOf('item=');
        if (ic != -1) {
            showItem(Number(urltail.substr(ic + 5)));
        } else {
            ic = urltail.indexOf('dex');
            if (ic != -1) {
                showDex();
            } else {
                ic = urltail.indexOf('bet');
                if (ic != -1) {
                    showBet();
                } else {
                    ic = urltail.indexOf('pet')

                    if (ic != -1) {
                        showPet();
                    } else {
                        alleventv.mode = 1;
                        showEle('v_ranks', true);
                        showEle('voteitdex', false);
                        showEle('v_itemdetail', false);
                        showEle('v_betgame', false);
                        showEle('v_pets', false);
                        createRanksOfCate(1);
                        view_type = VIEW_RANK;
                    }
                }
            }
        }
    }
}
window.onpopstate = function(event) {
    routeByHash();
};

function showBet() {
    showEle('v_betgame', true);
    showEle('voteitdex', false);
    showEle('v_ranks', false);
    showEle('v_itemdetail', false);
    showEle('v_pets', false);
    view_type = VIEW_BET;
}

function showPet() {
    showEle('v_pets', true);
    showEle('v_betgame', false);
    showEle('voteitdex', false);
    showEle('v_ranks', false);
    showEle('v_itemdetail', false);
    view_type = VIEW_PET;
}

function showDex() {
    alleventv.mode = 3;
    alleventv.switchSideTab();
    showEle('voteitdex', true);
    showEle('v_betgame', false);
    showEle('v_ranks', false);
    showEle('v_itemdetail', false);
    view_type = VIEW_DEX;
}

function showEle(eleid, show) {
    var ele = document.getElementById(eleid);
    if (ele) {
        if (show) {
            ele.classList.remove("vhide");
        } else {
            ele.classList.add("vhide");
        }
    }
}

function showSupporter(show) {
    alleventv.showSupport = show;
}

function clickSellItem(e) {
    let si = Number(e.id);
    vue_dex.buyPrice = vue_dex.sellorders[si].price / 1000000;
}

function clickBuyItem(e) {
    let bi = Number(e.id);
    vue_dex.sellPrice = vue_dex.buyorders[bi].price / 1000000;
}
