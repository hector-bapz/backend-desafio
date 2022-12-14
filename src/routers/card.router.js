import express from "express";
import * as cardUseCase from "../useCase/card.use.js";
import * as commentUseCase from "../useCase/comment.use.js";
import { auth } from "../middlewares/auth.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/all", async (request, response, next) => {
  try {
    let allPosts = "";
    const { idUser } = request.query;
    if (idUser) {
      allPosts = await cardUseCase.getByUser(idUser);
    } else {
      allPosts = await cardUseCase.getAll();
    }
    response.json({
      success: true,
      data: {
        posts: allPosts,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", auth, async (request, response, next) => {
  try {
    const { auth } = request;
    const allPosts = await cardUseCase.getByUser(auth);
    response.json({
      success: true,
      data: {
        posts: allPosts,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:idPost", async (request, response, next) => {
  try {
    const { idPost } = request.params;
    const card = await cardUseCase.getById(idPost);

    response.json({
      success: true,
      data: {
        cards: card,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (request, response, next) => {
  try {
    const { body: newPostContent, auth } = request;
    const newPost = await cardUseCase.create(newPostContent, auth);

    response.json({
      success: true,
      data: {
        post: newPost,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:idPost", auth, async (request, response, next) => {
  try {
    const { idPost } = request.params;
    const { auth } = request;
    const cardDeleted = await cardUseCase.deleteById(idPost, auth);
    const commentsDeleted = await commentUseCase.deletePostComments(idPost);
    response.status(200).json({
      success: true,
      card: cardDeleted,
      comments: commentsDeleted,
      message: "card Deleted!",
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:idPost", auth, async (request, response, next) => {
  try {
    const updateCardRequest = request.body;
    const { auth } = request;
    const { idPost } = request.params;
    const cardUpdated = await cardUseCase.update(
      idPost,
      updateCardRequest,
      auth
    );
    response.status(200).json({
      success: true,
      card: cardUpdated,
      message: "card Updated!",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
