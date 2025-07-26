export default class User {
    constructor() {
        this.fields = {
            Id: { type: 'int', required: true },
            Apellido: { type: 'nvarchar(100)', required: true },
            Nombre: { type: 'nvarchar(100)', required: true },
            Email: { type: 'nvarchar(150)', required: true },
            Telefono: { type: 'nvarchar(20)', required: false },
            FechaRegistro: { type: 'datetime', required: true },
            PasswordHash: { type: 'nvarchar(MAX)', required: true },
            Rol: { type: 'nvarchar(20)', required: true, default: 'cliente' },
            CodigoVerificacion: { type: 'nvarchar(6)', required: false, default: null },
            CodigoExpiracion: { type: 'datetime', required: false, default: null },
            FechaVerificacion: { type: 'datetime', required: false, default: null },
            EmailVerificado: { type: 'bit', required: false, default: false }
        };
    }
}