import moment from "moment";
import { Db } from "mongodb";
import { BaseService } from "./base.service";

export class ProductsService extends BaseService{
  constructor(protected dbconnection: Db) {
    super(dbconnection, 'products')
  }

  addTowishlist = async (product) => {
    const count = await this.dbconnection
      .collection("wishlist")
      .countDocuments();
    await this.dbconnection
      .collection("wishlist")
      .insertOne({
        name: product,
        date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
        id: count,
      });
  };

  removeWishlist = async (id) => {
    const result = await this.dbconnection
      .collection("wishlist")
      .deleteOne({ id: parseInt(id) });
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.", id);
    } else {
      console.log("No documents matched the query. Deleted 0 documents.", {
        id,
      });
    }
  };

  getWishlist = async () => {
    return this.dbconnection.collection("wishlist").find().toArray();
  };

  getWishlistById = async (id) => {
    return this.dbconnection
      .collection("wishlist")
      .find({ id: parseInt(id) })
      .toArray();
  };

  getWishlistByName = async (id) => {
    return this.dbconnection
      .collection("wishlist")
      .find({ name: parseInt(id) })
      .toArray();
  };

  emptyWishlist = async () => {
    return this.dbconnection.collection("wishlist").deleteMany((x) => x);
  };

  async addToCategory(product, category) {
    const wishlist = this.dbconnection.collection("wishlist");

    // create a filter for a movie to update

    const filter = { name: product };

    // this option instructs the method to create a document if no documents match the filter

    const options = { upsert: true };

    // create a document that sets the plot of the movie

    const updateDoc = {

      $set: {

        category

      },

    };

    const result = await wishlist.updateOne(filter, updateDoc, options);

    console.log(

      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,

    );
  }
}
