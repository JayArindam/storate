import { User } from "./models/user.model"
import { Store } from "./models/store.model";
import { StoreReview } from "./models/storeReview.model";

// 1 user (store owner) -> 1 store
User.hasOne(Store, { foreignKey: "ownerId" });
Store.belongsTo(User, { foreignKey: "ownerId" });

// 1 store -> many reviews
Store.hasMany(StoreReview, { foreignKey: "storeId" });
StoreReview.belongsTo(Store, { foreignKey: "storeId" });