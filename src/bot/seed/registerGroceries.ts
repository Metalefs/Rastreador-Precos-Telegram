import { Db } from "mongodb";
import { dbconnection } from "../../database";
import { groceries } from "../../shared/models/groceries";

export default async function main(){
    await dbconnection().then(([db,connection])=>{
        try{
            (db as any as Db).collection('default_groceries').deleteMany(x=>x?.name);
        }
        catch(ex){

        }
        (db as any as Db).collection('default_groceries').insertMany(
            groceries.map((cat,id)=>{
                return {
                    id,
                    ...cat
                }
            })
        )
    })
}

main();