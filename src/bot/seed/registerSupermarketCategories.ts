import { Db } from "mongodb";
import { dbconnection } from "../../database";
import { supermaketCategories } from "../../shared/models/supermarket-categories";

export default async function main(){
    await dbconnection().then(([db,connection])=>{
        try{
            (db as any as Db).collection('supermarketCategories').deleteMany(x=>x?.name);
        }
        catch(ex){

        }
        (db as any as Db).collection('supermarketCategories').insertMany(
            supermaketCategories.map((cat,id)=>{
                return {
                    id,
                    name: cat
                }
            })
        )
    })
}

main();