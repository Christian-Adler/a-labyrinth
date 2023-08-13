export const clear = ({ctx, HEIGHT, WIDTH}) => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
};