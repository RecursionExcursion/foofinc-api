import path from "path";
import { Response } from "express";

type ServerPageParams = {
  page: string;
  res: Response;
};

export const servePage = ({ page, res }: ServerPageParams) => {
  const pagePath = path.join(process.cwd(), "pages", page);
  res.sendFile(pagePath);
};
