var myCarousel = document.querySelector('#myCarousel')
var carousel = new bootstrap.Carousel(myCarousel)
let localTronweb = null;
let tronlinkWeb = null;
let vue_pets = null;
let uefa_vue = null;
let bk_vue = null; //book keeper

const VIEW_RANK = 1;
const VIEW_DEX = 2;
const VIEW_BET = 3;
const VIEW_PET = 4;
const VIEW_ITEM = 5;
const VIEW_BOOKKEEPER = 6;
let userAddr = null;
let view_type = VIEW_RANK;
let contractTokenId = '1003606';
const rncontract ='TWsCZAd45C23XJi2g8fVzxY5Tr5LyLqdFD';
const bkcontract = 'TDebauAMCe9MqsQUFAHtK6mUABRKaiJzSn'
const minercontract = 'TECu9sH4r5BZ373yBgBDsS3chC4s24cePA';
const petcontract = 'TJ5qtb9wUM9iNBzaRETcrVXBhPkuqBq4r9';
const instantcontract = 'TLysE9cYxfsDUrU25SZWpuNW5o6sF1gL3H';
const HttpProvider = TronWeb.providers.HttpProvider;
const trongridurl = 'https://sun.tronex.io';
//const sunurl = 'https://sun.tronex.io';
const fullNode = new HttpProvider(trongridurl);
const solidityNode = new HttpProvider(trongridurl);
const eventServer = new HttpProvider(trongridurl);
let k = ['4d376eb18ccde5a', 'a5a682860bc2a8b425546', '930d2b3f58bd2dd1a', 'f30d2a15'];
createLocalTronweb(fullNode, solidityNode, eventServer, ek().slice(1));

loginWithTronlink(null, 10000,null); 

function createLocalTronweb(fullNode, solidityNode, eventServer, privateKey) {
    localTronweb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
    userAddr = localTronweb.defaultAddress.base58;
    return localTronweb;
}

function loginWithTronlink(callback, timeout, TOcallback) {
    var obj = setInterval(async () => {
        if (window.sunWeb && window.sunWeb.sidechain && window.sunWeb.sidechain.defaultAddress.base58) {
            clearInterval(obj)
            console.log("tronlink connected");
            tronlinkWeb = window.sunWeb.sidechain;
            userAddr = tronlinkWeb.defaultAddress.base58;
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
function ele(ename)
{
  return document.getElementById(ename);
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


let contract_vue = new Vue({

    el:'#contract',
    data:{
        addr:'',
        funname:'',
        param1:'',
        param2:'',
        param3:'',
        token:0,
        trx:0,
    },
    methods:{
        readContract:function()
        {
            contractRead(this.addr, this.funname, function(data){
                console.log(data);
            }, paramConvert(this.param1),paramConvert(this.param2));
        },
        writeContract:function()
        {
            contractWrite(this.addr, this.funname, function(data){
                console.log(data);
            },paramConvert(this.param1),paramConvert(this.param2),paramConvert(this.param3));
        },
        writePayContract:function()
        {
            contractWritePay(this.addr, this.funname, function(data){
                console.log(data);
            },Number(this.token), Number(this.trx),paramConvert(this.param1),paramConvert(this.param2));
        }

    }

})
let bitbot_vue = new Vue({
    el: '#bitbot',
    data: {
        showType: 1,
        apis: [],
        params:[],
        bots:[],

        newApi:{},
        newParam:{},
        newBot:{},

    },
})

function getkey() {
    let pk = '';
    for (let i = 0; i < pkey1.length; i++) {
        pk += (i);
        pk += pkey1[i];
    }
    return pk;
}


function paramConvert(param)
{
   if(param.length == 0)
      return undefined;
   let np = parseInt(param);
   if(String(np) == param)
      return np;
   else
      return param;
}

async function contractWritePay(contractAddr, mname, callback, value,trxValue, param, param2) {
    if (value <= 0)
        return;
    if (tronlinkWeb) {
        try {
            let contract = await tronlinkWeb.contract().at(contractAddr);
            let obj = {
                feeLimit: 100_000_000,
                callValue: trxValue * 1000000,
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
            console.log(err + " " + mname);
            if (callback) {
                callback({
                    result: true,
                    retobj: err
                });
            }
        }
    }
}

async function contractWrite(contractAddr, mname, callback, param, param2,param3) {
    if (tronlinkWeb) {
        try {
            let contract = await tronlinkWeb.contract().at(contractAddr);
            let obj = {
                feeLimit: 100_000_000,
                callValue: 0,
                tokenId: '',
                tokenValue: 0,
                shouldPollResponse: false
            };
            let ret;
            
            if (param != undefined && param2 != undefined && param3 != undefined) {
                ret = await contract[mname](param, param2,param3).send(obj);
            }
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
            console.log(err + " " + mname);
            if (callback) {
                callback({
                    result: true,
                    retobj: err
                });
            }
        }
    }
}

async function contractRead(contractAddr,mname, callback, param, param2) {
    let optw = localTronweb;
    if (tronlinkWeb)
        optw = tronlinkWeb;
    if (optw) {
        try {
            let contract = await optw.contract().at(contractAddr);
            let ret;
            if (param != undefined && param2 != undefined) {
                ret = await contract[mname](param, param2).call();
            } else if (param != undefined)
                ret = await contract[mname](param).call();
            else
                ret = await contract[mname]().call();
            console.log(ret);
            if (callback) {
                callback({
                    result: true,
                    retobj: ret
                });
            }
        } catch (err) {
            console.log(err + " " + mname);
            if (callback) {
                callback({
                    result: true,
                    retobj: err
                });
            }
        }
    } else {
        console.log("NO tronweb");
    }
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

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
