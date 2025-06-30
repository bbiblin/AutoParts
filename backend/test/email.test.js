const request = require('supertest');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const emailRouter = require('../src/routes/email');
const nodemailer = require('nodemailer');

// 🛠️ Definir mocks antes de usarlos
const mockProductUpdate = jest.fn();
const mockPedidoUpdate = jest.fn();

jest.mock('nodemailer');
jest.mock('../src/models', () => ({
    pedidos: {
        create: jest.fn(),
        findOne: jest.fn()
    },
    detalle_pedido: {
        create: jest.fn()
    },
    cart: {
        findOne: jest.fn()
    },
    cart_item: {},
    producto: {
        update: jest.fn()
    }
}));

const { pedidos, detalle_pedido, cart } = require('../src/models');

// 🏗️ App Koa configurada con bodyParser y router
const app = new Koa();
app.use(bodyParser());
app.use(emailRouter.routes());

describe('POST /enviarEmail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        //      jest.spyOn(console, 'log').mockImplementation(() => { }); // opcional para limpiar logs
        //     jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    it('debe enviar un correo de cotización correctamente', async () => {
        const mockPedido = {
            id: 1,
            createdAt: new Date(),
            update: mockPedidoUpdate,
            detalles_pedido: [
                {
                    cantidad: 2,
                    subtotal: 2000,
                    product: {
                        stock: 10,
                        product_name: 'Producto X',
                        product_cod: 'P001',
                        update: mockProductUpdate
                    }
                }
            ]
        };

        // 🧪 Mock del carrito
        cart.findOne.mockResolvedValue({
            cart_items: [
                {
                    quantity: 2,
                    product_id: 1,
                    product: {
                        wholesale_price: 1000,
                        wholesale_price_sale: 900,
                        discount_percentage: 0,
                        stock: 10
                    }
                }
            ]
        });

        // 🧪 Mocks de pedido
        pedidos.create.mockResolvedValue({ id: 1, createdAt: new Date() });
        detalle_pedido.create.mockResolvedValue({});
        pedidos.findOne.mockResolvedValue(mockPedido);

        // 🧪 Mock de nodemailer
        const sendMailMock = jest.fn().mockResolvedValue({ messageId: 'mock-id' });
        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

        // 📤 Realizar petición
        const res = await request(app.callback())
            .post('/enviarEmail')
            .send({
                email: 'test@example.com',
                nombre: 'Test',
                user_id: 1
            });
        console.log('Error body:', res.body);

        // ✅ Aserciones
        expect(res.status).toBe(200);
        expect(res.body.estado).toBe('aceptado');
        expect(sendMailMock).toHaveBeenCalled();

        const correoEnviado = sendMailMock.mock.calls[0][0];
        expect(correoEnviado.to).toBe('test@example.com');
        expect(correoEnviado.subject).toContain('Cotización');
        expect(correoEnviado.text).toContain('Producto X');
        expect(correoEnviado.text).toContain('P001');
        expect(correoEnviado.text).toContain('Hola Test');

        expect(mockPedidoUpdate).toHaveBeenCalledWith({ state: 'cotización enviada' });
        expect(mockProductUpdate).toHaveBeenCalled();
    });

    it('retorna 400 si el carrito está vacío', async () => {
        cart.findOne.mockResolvedValue({ cart_items: [] });

        const res = await request(app.callback()).post('/enviarEmail').send({
            email: 'test@example.com',
            nombre: 'Test',
            user_id: 1
        });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Carrito vacío o no encontrado');
    });

    it('maneja errores internos correctamente', async () => {
        cart.findOne.mockRejectedValue(new Error('DB error'));

        const res = await request(app.callback()).post('/enviarEmail').send({
            email: 'test@example.com',
            nombre: 'Test',
            user_id: 1
        });

        expect(res.status).toBe(500);
        expect(res.body.estado).toBe('error');

        expect(res.body.mensaje).toBe('No se pudo enviar el correo');

    });
});
