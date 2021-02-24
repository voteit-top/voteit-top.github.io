//rawPet has unique ID from 1
//marketPet has unique ID from 1
//foods  has unique ID from 1
let petcontract='';
let vue_petsmarket = new Vue(
{
	el:"#v_pets",
	data:{
		rawPets:[],
		marketGems:[],
		marketPets:[],
		totalPets:0,

	}
	,
	methods:
	{
		pick:function(petId){

		},
		buy:function(petId)
		{

		},
		sell:function(petId){

		},
		release:function(petId)
		{

		},
		feed:function(petId)
		{

		}
	}
}
);
let vue_petsranking = new Vue(
	{
	el:"#elment",
	data:{
		pets:[],
	}
	}
);

getRawPets(function(ret){
	if(ret.result)
	{
		let pets = ret.retobj;
		for(let i=0;i<pets.length;i++)
		{
			getRawPetDetail(pets[i], function(ret1){
				let pet = {};
				//pet.name=
				//pet.price=
				//pet.hot=

				vue_petsmarket.rawPets.push(pet);

			});

		}
	}
});

getMarketPets(function(ret){
	if(ret.result)
	{
		let mpets = ret.retobj;
		for(let i=0;i<mpets.length;i++)
		{
			getMarketPetDetail(mpets[i], function(ret1){
				let mpet = {};
				//pet.name=
				//pet.price=
				//pet.hot=

				vue_petsmarket.marketPets.push(pet);

			});

		}
	}
})
async function readPetMetrics()
{

}
//system
//type is :dog, cat...
async function addRawPet(svgfile, type, name)
{

}

async function addFood(svgfile, type, name)
{

}
async function getFoodDetail(foodId, callback)
{

}
async function getRawPetDetail(petId, callback)
{

}
async function getRawPets(callback)
{
	if(localTronweb)
    {
			try{
				//access contract
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
//other users
async function getMarketPets(callback)
{
	if(localTronweb)
    {
			try{
				//access contract
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
async function getMyPets(callback)
{

}
//pick pet from raw pets.
async function pickPet(petId,callback)
{

}
//release pet. pet will gone.
async function releasePet(petId, callback)
{

}
async function feedPet(petId, callback)
{

}
async function getMarketPetDetail(petId, callback)
{

}
//sell pet in market
async function sellPet(petId, price, callback)
{
     
}
//buy pet from market
async function buyPet(petId, price, callback)
{
	if(!tronlinkWeb)
    {
        tronlinkNotConnected();
    }
    else
    {
			try{
				//buy pets from contract
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
