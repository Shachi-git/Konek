"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
import { SanityDocumentStub } from "next-sanity";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs'

export const createPitch = async (
  state: any,
  form: FormData,
  pitch: string,
) => {
  const session = await auth();

  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });

  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch"),
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const startup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.user?.id,
      },
      pitch,
    };

    const result = await writeClient.create({ _type: "startup", ...startup });

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};


export const createUser = async (
  state: any,
  formData: FormData,
  exclude: string[] = []
) => {
  const extracted = Object.fromEntries(
    Array.from(formData.entries()).filter(([key]) => !exclude.includes(key))
  );

  const name = extracted.name as string;
  const username = extracted.username as string;
  const email = extracted.email as string;
  const bio = extracted.bio as string;
  const password = extracted.password as string;

  try {
    const image = formData.get("image");
    const hashedPassword = await bcrypt.hash(password, 10)

    const authorDoc: SanityDocumentStub = {
      _type: "author",
      id: uuidv4(),
      name,
      username,
      email,
      bio,
      password: hashedPassword,
    };

    if (image instanceof File) {
      const uploadedImage = await writeClient.assets.upload("image", image, {
        filename: image.name,
      });

      authorDoc.image = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: uploadedImage._id,
        },
      };
    }

    const result = await writeClient.create(authorDoc);

    return parseServerActionResponse({
      ...result,
      status: "SUCCESS",
      error: "",
    });
  } catch (error) {
    console.error(error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};
