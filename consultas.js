const pool = require("./db/conexion");
const format = require('pg-format');

const prepararHATEOAS = (inventario) => {
    const results = inventario.map((m) => {
    return {
        name: m.nombre,
        categoria: m.categoria,
        metal: m.metal,
        precio: m.precio,
        href: `/inventario/joyas/${m.id}`,
    }
    }).slice(0, 4)
    const total = inventario.length
    const HATEOAS = {
    total,
    results
    }
    return HATEOAS
    }
    

const obtenerJoyas = async ({ limits = 10, order_by = "id_ASC", page = 1 }) => {
    try {
        const [campo, direccion] = order_by.split("_");
        const offset = (page - 1) * limits;

        const formattedQuery = format("SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s", campo, direccion, limits, offset);
        
        const { rows: inventario } = await pool.query(formattedQuery);
        
        return inventario;
    } catch (error) {
        console.error("Error in obtenerJoyas:", error.message);
        throw error; 
    }
};

const obtenerJoyasPorFiltros = async ({ precio_max, precio_min, categoria, metal }) => {
    try {
        let filtros = [];
        const values = [];

        const agregarFiltro = (campo, comparador, valor) => {
            values.push(valor);
            const { length } = filtros;
            filtros.push(`${campo} ${comparador} $${length + 1}`);
        };

        if (precio_max) agregarFiltro('precio', '<=', precio_max);
        if (precio_min) agregarFiltro('precio', '>=', precio_min);
        if (categoria) agregarFiltro('categoria', '=', categoria);
        if (metal) agregarFiltro('metal', '=', metal);

        let consulta = "SELECT * FROM inventario";

        if (filtros.length > 0) {
            filtros = filtros.join(" AND ");
            consulta += ` WHERE ${filtros}`;
        }

        const { rows: inventario } = await pool.query(consulta, values);
        
        return inventario;
    } catch (error) {
        console.error("Error in obtenerJoyasPorFiltros:", error.message);
        throw error; 
    }
};

module.exports = { obtenerJoyas, obtenerJoyasPorFiltros, prepararHATEOAS };
