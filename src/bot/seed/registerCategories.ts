import { Db } from "mongodb";
import { dbconnection } from "../../database";
import { categories } from "../../models/categories";

export default async function main(){
    await dbconnection().then(([db,connection])=>{
        try{
            (db as any as Db).collection('categories').deleteMany(x=>x?.name);
        }
        catch(ex){

        }
        (db as any as Db).collection('categories').insertMany(
            categories.map((cat,id)=>{
                return {
                    id,
                    name: cat
                }
            })
        )
    })
}

main();