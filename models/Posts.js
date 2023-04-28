module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("Posts", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postText: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    // powiązanie z tabela Comments, każdy post może miec wiele komentarzy
    Posts.associate = (models) => {
        Posts.hasMany(models.Comments, {
            // jeśli usunę post to automatycznie wszystkie powiązane komentarze też bedą usunięte
            onDelete: "cascade",
        })
        Posts.hasMany(models.Likes, {
            onDelete: "cascade",
        })
    }
    return Posts
}