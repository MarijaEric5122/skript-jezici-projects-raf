import { Request, Response } from "express";
import AppDataSource from "../../data-source";
import { Picture } from "../../entities/Picture";
import { User } from "../../entities/User";
import { NewPictureReq } from "../../types";

// GET /pictures
export const listPictures = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const authorParam = req.query.author as string | undefined;

    const whereConditions: any = {};
    if (authorParam) {
      whereConditions.author = { user_id: authorParam };
    }

    const pictureRepo = AppDataSource.getRepository(Picture);
    const [pictures, total] = await pictureRepo.findAndCount({
      relations: ["author"],
      where: whereConditions,
      order: { created_at: "DESC" },
      skip,
      take: limit,
    });

    res.json({
      failed: false,
      pictures: pictures.map((p) => ({
        picture_id: p.picture_id,
        name: p.name,
        picture_data: JSON.parse(p.picture_data),
        author: {
          user_id: p.author.user_id,
          username: p.author.username,
        },
        created_at: p.created_at,
        updated_at: p.updated_at,
      })),
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
    return;
  } catch (error) {
    console.error("listPictures error:", error);
    res.status(500).json({
      failed: true,
      code: "INTERNAL_ERROR",
    });
    return;
  }
};

// GET /pictures/:pictureId
export const getPicture = async (req: Request, res: Response) => {
  try {
    const { pictureId } = req.params;
    const pictureRepo = AppDataSource.getRepository(Picture);
    const picture = await pictureRepo.findOne({
      where: { picture_id: pictureId },
      relations: ["author"],
    });

    if (!picture) {
      res.status(404).json({
        failed: true,
        code: "NO_SUCH_ENTITY",
      });
      return;
    }

    res.json({
      failed: false,
      picture: {
        picture_id: picture.picture_id,
        name: picture.name,
        picture_data: JSON.parse(picture.picture_data),
        author: {
          user_id: picture.author.user_id,
          username: picture.author.username,
        },
        created_at: picture.created_at,
        updated_at: picture.updated_at,
      },
    });
    return;
  } catch (error) {
    console.error("getPicture error:", error);
    res.status(500).json({
      failed: true,
      code: "INTERNAL_ERROR",
    });
  }
};

// POST /pictures
export const createPicture = async (req: Request, res: Response) => {
  try {
    const user = req.user as User; // from authGuard
    const { name, picture_data } = req.body as NewPictureReq;

    const pictureRepo = AppDataSource.getRepository(Picture);

    const newPicture = pictureRepo.create({
      name,
      picture_data: JSON.stringify(picture_data),
      author: user,
    });

    await pictureRepo.save(newPicture);

    res.json({
      failed: false,
      picture_id: newPicture.picture_id,
    });
    return;
  } catch (error) {
    console.error("createPicture error:", error);
    res.status(500).json({
      failed: true,
      code: "INTERNAL_ERROR",
    });
  }
};

// PATCH /pictures/:pictureId
export const updatePicture = async (req: Request, res: Response) => {
  try {
    const { pictureId } = req.params;
    const { name, picture_data } = req.body;
    const user = req.user as User;

    const pictureRepo = AppDataSource.getRepository(Picture);
    const existingPicture = await pictureRepo.findOne({
      where: { picture_id: pictureId },
      relations: ["author"],
    });

    if (!existingPicture) {
      res.status(404).json({
        failed: true,
        code: "NO_SUCH_ENTITY",
      });
      return;
    }

    // Ensure it belongs to the user
    if (existingPicture.author.user_id !== user.user_id) {
      res.status(403).json({
        failed: true,
        code: "NOT_YOURS",
      });
      return;
    }

    if (name !== undefined) existingPicture.name = name;
    if (picture_data !== undefined) {
      existingPicture.picture_data = JSON.stringify(picture_data);
    }

    await pictureRepo.save(existingPicture);

    res.json({
      failed: false,
    });
    return;
  } catch (error) {
    console.error("updatePicture error:", error);
    res.status(500).json({
      failed: true,
      code: "INTERNAL_ERROR",
    });
  }
};

// DELETE /pictures/:pictureId
export const deletePicture = async (req: Request, res: Response) => {
  try {
    const { pictureId } = req.params;
    const user = req.user as User;

    const pictureRepo = AppDataSource.getRepository(Picture);
    const existingPicture = await pictureRepo.findOne({
      where: { picture_id: pictureId },
      relations: ["author"],
    });

    if (!existingPicture) {
      res.status(404).json({
        failed: true,
        code: "NO_SUCH_ENTITY",
      });
      return;
    }

    if (existingPicture.author.user_id !== user.user_id) {
      res.status(403).json({
        failed: true,
        code: "NOT_YOURS",
      });
      return;
    }

    await pictureRepo.remove(existingPicture);

    res.json({
      failed: false,
    });
    return;
  } catch (error) {
    console.error("deletePicture error:", error);
    res.status(500).json({
      failed: true,
      code: "INTERNAL_ERROR",
    });
  }
};
