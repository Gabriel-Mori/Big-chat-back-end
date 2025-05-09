import {Request, Response, NextFunction} from "express";
import * as yup from "yup";
import authService from "../services/authService";

class AuthController {
  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const schema = yup.object().shape({
        documentId: yup.string().required("Document ID is required"),
        documentType: yup
          .string()
          .oneOf(["CPF", "CNPJ"], "Document type must be CPF or CNPJ")
          .required("Document type is required"),
      });

      await schema.validate(req.body);

      const authResponse = await authService.authenticate({
        documentId: req.body.documentId,
        documentType: req.body.documentType,
      });

      if (!authResponse) {
        return res.status(401).json({message: "Invalid credentials"});
      }

      return res.status(200).json(authResponse);
    } catch (error) {
      next(error);
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({message: error.message});
      }

      console.error("Login error:", error);
      return res.status(500).json({message: "Internal server error"});
    }
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      const schema = yup.object().shape({
        documentId: yup.string().required("Document ID is required"),
        documentType: yup
          .string()
          .oneOf(["CPF", "CNPJ"], "Document type must be CPF or CNPJ")
          .required("Document type is required"),
        name: yup.string().required("Name is required"),
      });

      console.log("LOG:(authController) - req.body", req.body);

      await schema.validate(req.body);

      const {documentId, documentType, name} = req.body;
      const authResponse = await authService.register({
        documentId,
        documentType,
        name,
      });

      if (!authResponse) {
        return res.status(401).json({message: "Invalid credentials"});
      }

      return res.status(200).json(authResponse);
    } catch (error) {
      next(error);
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({message: error.message});
      }

      console.error("Register error:", error);
      return res.status(500).json({message: "Internal server error"});
    }
  }
}

export default new AuthController();
