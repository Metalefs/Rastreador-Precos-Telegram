import { Db } from "mongodb";
import { dbconnection } from "../database";
import { categories } from "../models/categories/detailed";

const products = categories;

export default async function main(){
    await dbconnection().then(([db,connection])=>{
        try{
            (db as any as Db).collection('products').deleteMany(x=>x?.name);
        }
        catch(ex){

        }
        (db as any as Db).collection('products').insertMany(
            products
        )
    })
}

main();