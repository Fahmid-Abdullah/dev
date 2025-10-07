import jwt from "jsonwebtoken";

export const generateToken = ({ id, email }: { id: number, email: string }) => (
    jwt.sign({ id, email }, process.env.JWT_SECRET as string, {
        expiresIn: "1h"
    })
)

export const verifyToken = ({ token }: { token: string }) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (err) {
        console.log(err);
        return null;
    }
}