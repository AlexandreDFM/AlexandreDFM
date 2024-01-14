import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const trustedOrigins: string[] = [
        "http://localhost:8080",
        "http://api.alexandredfm.fr",
    ];
    app.enableCors({
        origin: trustedOrigins,
    });
    await app.listen(3000);
}
bootstrap();
