// ============================================
// BAJASOFT - SISTEMA DE COTIZACIÓN
// Conexión con Supabase
// ============================================

// Configuración de Supabase
const SUPABASE_URL = 'https://uzsucturqfhcwuypkrai.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6c3VjdHVycWZoY3d1eXBrcmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NTY4NTUsImV4cCI6MjA4MDUzMjg1NX0.8sstdIZShYvnwQVdCqKt_q5QwNvtfZFZUEK8mLKNlto';

// Inicializar cliente de Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// MODAL DE COTIZACIÓN
// ============================================

// Crear el modal dinámicamente
function createQuoteModal() {
    const modalHTML = `
    <div id="quoteModal" class="quote-modal">
        <div class="quote-modal-overlay"></div>
        <div class="quote-modal-content">
            <button class="quote-modal-close" onclick="closeQuoteModal()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
            
            <div class="quote-modal-header">
                <h2>Solicitar Cotización</h2>
                <p>Cuéntanos sobre tu proyecto y te contactamos pronto.</p>
            </div>
            
            <form id="quoteForm" class="quote-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="nombre_completo">Nombre completo <span class="required">*</span></label>
                        <input type="text" id="nombre_completo" name="nombre_completo" required placeholder="Tu nombre completo">
                    </div>
                    <div class="form-group">
                        <label for="correo">Correo electrónico <span class="required">*</span></label>
                        <input type="email" id="correo" name="correo" required placeholder="tu@email.com">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="telefono">Teléfono <span class="required">*</span></label>
                        <input type="tel" id="telefono" name="telefono" required placeholder="+52 664 000 0000">
                    </div>
                    <div class="form-group">
                        <label for="empresa">Empresa <span class="optional">(opcional)</span></label>
                        <input type="text" id="empresa" name="empresa" placeholder="Nombre de tu empresa">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>¿Qué tipo de proyecto necesitas? <span class="required">*</span></label>
                    <div class="checkbox-grid">
                        <label class="checkbox-item">
                            <input type="checkbox" name="pagina_web" id="pagina_web">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">Página Web</span>
                        </label>
                        <label class="checkbox-item">
                            <input type="checkbox" name="software_medida" id="software_medida">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">Software a la Medida</span>
                        </label>
                        <label class="checkbox-item">
                            <input type="checkbox" name="aplicacion_movil" id="aplicacion_movil">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">Aplicación Móvil</span>
                        </label>
                        <label class="checkbox-item">
                            <input type="checkbox" name="credenciales" id="credenciales">
                            <span class="checkbox-custom"></span>
                            <span class="checkbox-label">Credenciales Inteligentes</span>
                        </label>
                    </div>
                    <span class="checkbox-error" id="checkboxError">Selecciona al menos un tipo de proyecto</span>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="fecha_entrega">Fecha de entrega deseada <span class="optional">(opcional)</span></label>
                        <input type="date" id="fecha_entrega" name="fecha_entrega" min="">
                    </div>
                    <div class="form-group">
                        <label for="presupuesto">Presupuesto aproximado <span class="optional">(opcional)</span></label>
                        <select id="presupuesto" name="presupuesto">
                            <option value="">Selecciona un rango</option>
                            <option value="menos_20k">Menos de $20,000 MXN</option>
                            <option value="20k_50k">$20,000 - $50,000 MXN</option>
                            <option value="50k_100k">$50,000 - $100,000 MXN</option>
                            <option value="100k_200k">$100,000 - $200,000 MXN</option>
                            <option value="mas_200k">Más de $200,000 MXN</option>
                            <option value="no_definido">Aún no lo tengo definido</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="descripcion_proyecto">Descripción del proyecto <span class="required">*</span></label>
                    <textarea id="descripcion_proyecto" name="descripcion_proyecto" required rows="4" placeholder="Cuéntanos qué necesitas, qué problema quieres resolver y cualquier detalle relevante..."></textarea>
                </div>
                
                <div class="form-footer">
                    <p class="form-note">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 16v-4M12 8h.01"/>
                        </svg>
                        Te responderemos en menos de 24 horas hábiles.
                    </p>
                    <button type="submit" class="btn-submit" id="submitBtn">
                        <span class="btn-text">Enviar cotización</span>
                        <span class="btn-loading">
                            <svg class="spinner" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="30 70"/>
                            </svg>
                            Enviando...
                        </span>
                    </button>
                </div>
            </form>
            
            <div id="quoteSuccess" class="quote-success" style="display: none;">
                <div class="success-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                </div>
                <h3>¡Cotización enviada!</h3>
                <p>Gracias por contactarnos. Te responderemos pronto a <strong id="successEmail"></strong></p>
                <button onclick="closeQuoteModal()" class="btn-primary">Cerrar</button>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Establecer fecha mínima como hoy
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha_entrega').setAttribute('min', today);
    
    // Event listeners
    document.querySelector('.quote-modal-overlay').addEventListener('click', closeQuoteModal);
    document.getElementById('quoteForm').addEventListener('submit', handleFormSubmit);
    
    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeQuoteModal();
    });
}

// Abrir modal
function openQuoteModal(preselect = null) {
    const modal = document.getElementById('quoteModal');
    if (!modal) {
        createQuoteModal();
    }
    
    // Reset form
    document.getElementById('quoteForm').reset();
    document.getElementById('quoteForm').style.display = 'block';
    document.getElementById('quoteSuccess').style.display = 'none';
    document.getElementById('submitBtn').classList.remove('loading');
    document.getElementById('checkboxError').style.display = 'none';
    
    // Preseleccionar tipo si viene desde una página específica
    if (preselect) {
        const checkbox = document.getElementById(preselect);
        if (checkbox) checkbox.checked = true;
    }
    
    document.getElementById('quoteModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus en el primer campo
    setTimeout(() => {
        document.getElementById('nombre_completo').focus();
    }, 300);
}

// Cerrar modal
function closeQuoteModal() {
    const modal = document.getElementById('quoteModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Validar checkboxes
function validateCheckboxes() {
    const checkboxes = document.querySelectorAll('.checkbox-grid input[type="checkbox"]');
    const isChecked = Array.from(checkboxes).some(cb => cb.checked);
    const errorEl = document.getElementById('checkboxError');
    
    if (!isChecked) {
        errorEl.style.display = 'block';
        return false;
    }
    errorEl.style.display = 'none';
    return true;
}

// Manejar envío del formulario
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validar checkboxes
    if (!validateCheckboxes()) return;
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Recopilar datos
    const formData = {
        nombre_completo: document.getElementById('nombre_completo').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        empresa: document.getElementById('empresa').value.trim() || null,
        pagina_web: document.getElementById('pagina_web').checked,
        software_medida: document.getElementById('software_medida').checked,
        aplicacion_movil: document.getElementById('aplicacion_movil').checked,
        credenciales: document.getElementById('credenciales').checked,
        fecha_entrega: document.getElementById('fecha_entrega').value || null,
        descripcion_proyecto: document.getElementById('descripcion_proyecto').value.trim(),
        presupuesto: document.getElementById('presupuesto').value || null,
        created_at: new Date().toISOString()
    };
    
    try {
        // Enviar a Supabase
        const { data, error } = await supabaseClient
            .from('contacto_webpage')
            .insert([formData]);
        
        if (error) throw error;
        
        // Mostrar éxito
        document.getElementById('quoteForm').style.display = 'none';
        document.getElementById('successEmail').textContent = formData.correo;
        document.getElementById('quoteSuccess').style.display = 'block';
        
    } catch (error) {
        console.error('Error al enviar:', error);
        alert('Hubo un error al enviar tu cotización. Por favor intenta de nuevo o contáctanos por WhatsApp.');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    createQuoteModal();
    
    // Actualizar todos los botones de cotizar para abrir el modal
    updateQuoteButtons();
});

// Actualizar botones de cotizar
function updateQuoteButtons() {
    // Seleccionar botones que deben abrir el modal
    const quoteButtons = document.querySelectorAll('[data-quote], .btn-quote');
    
    quoteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const preselect = btn.getAttribute('data-quote');
            openQuoteModal(preselect);
        });
    });
}

// Función global para abrir modal desde onclick en HTML
window.openQuoteModal = openQuoteModal;
window.closeQuoteModal = closeQuoteModal;
