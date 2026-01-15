import { useState } from 'react';
import { useApp } from '../App';
import { Send, Mail, MessageSquare, Upload, Check } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function Contact() {
  const { theme, language } = useApp();
  const [contactType, setContactType] = useState<'robot' | 'message'>('message');
  const [formData, setFormData] = useState({
    name: '',
    contactMethod: '',
    message: '',
    // Robot submission fields
    teamNumber: '',
    teamName: '',
    robotName: '',
    season: '',
    cadLink: '',
    codeLink: '',
    imageLink: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const bgColor = theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50';
  const sectionBg = theme === 'dark' ? 'bg-slate-900' : 'bg-white';
  const cardBg = theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subtextColor = theme === 'dark' ? 'text-slate-300' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-red-500/20' : 'border-red-200';
  const inputBg = theme === 'dark' ? 'bg-slate-800' : 'bg-white';
  const inputBorder = theme === 'dark' ? 'border-slate-700' : 'border-gray-300';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5881ae94/contact`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: contactType,
            ...formData,
            submittedAt: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          contactMethod: '',
          message: '',
          teamNumber: '',
          teamName: '',
          robotName: '',
          season: '',
          cadLink: '',
          codeLink: '',
          imageLink: '',
          description: '',
        });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (err) {
      setError(language === 'en' ? 'Failed to send message. Please try again.' : 'Falha ao enviar mensagem. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen pt-24 pb-16 ${bgColor} transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-6">
            <span className="text-red-500">{language === 'en' ? 'Get in Touch' : 'Entre em Contato'}</span>
          </div>
          <h1 className={`text-4xl ${textColor} mb-4`}>
            {language === 'en' ? 'Contact Us' : 'Fale Conosco'}
          </h1>
          <p className={`${subtextColor} max-w-2xl mx-auto`}>
            {language === 'en' 
              ? 'Have a question or want to submit your robot to our database? We\'d love to hear from you!'
              : 'Tem uma pergunta ou quer enviar seu robô para nosso banco de dados? Adoraríamos ouvir de você!'}
          </p>
        </div>

        {/* Contact Type Selector */}
        <div className={`${sectionBg} border ${borderColor} rounded-2xl p-8 mb-8`}>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setContactType('message')}
              className={`p-6 rounded-xl border-2 transition-all ${
                contactType === 'message'
                  ? 'border-red-500 bg-red-500/10'
                  : `border-transparent ${cardBg} hover:border-red-500/30`
              }`}
            >
              <MessageSquare className={contactType === 'message' ? 'text-red-500' : subtextColor} size={32} />
              <h3 className={`${textColor} mt-4 mb-2`}>
                {language === 'en' ? 'Send a Message' : 'Enviar Mensagem'}
              </h3>
              <p className={`text-sm ${subtextColor}`}>
                {language === 'en' 
                  ? 'General inquiries and questions'
                  : 'Perguntas e dúvidas gerais'}
              </p>
            </button>

            <button
              onClick={() => setContactType('robot')}
              className={`p-6 rounded-xl border-2 transition-all ${
                contactType === 'robot'
                  ? 'border-red-500 bg-red-500/10'
                  : `border-transparent ${cardBg} hover:border-red-500/30`
              }`}
            >
              <Upload className={contactType === 'robot' ? 'text-red-500' : subtextColor} size={32} />
              <h3 className={`${textColor} mt-4 mb-2`}>
                {language === 'en' ? 'Submit a Robot' : 'Enviar um Robô'}
              </h3>
              <p className={`text-sm ${subtextColor}`}>
                {language === 'en' 
                  ? 'Add your robot to our database'
                  : 'Adicione seu robô ao nosso banco de dados'}
              </p>
            </button>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Common Fields */}
            <div>
              <label className={`block ${textColor} mb-2`}>
                {language === 'en' ? 'Your Name / Team Name' : 'Seu Nome / Nome da Equipe'} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 ${inputBg} border ${inputBorder} rounded-lg ${textColor} focus:outline-none focus:border-red-500`}
                placeholder={language === 'en' ? 'John Doe / Team Alpha' : 'João Silva / Equipe Alpha'}
              />
            </div>

            <div>
              <label className={`block ${textColor} mb-2`}>
                {language === 'en' ? 'Contact Method (Email, Phone, Instagram, etc.)' : 'Método de Contato (Email, Telefone, Instagram, etc.)'} *
              </label>
              <input
                type="text"
                required
                value={formData.contactMethod}
                onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                className={`w-full px-4 py-3 ${inputBg} border ${inputBorder} rounded-lg ${textColor} focus:outline-none focus:border-red-500`}
                placeholder={language === 'en' ? 'email@example.com or @username' : 'email@exemplo.com ou @usuario'}
              />
            </div>

            {/* Robot Submission Fields */}
            {contactType === 'robot' && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block ${textColor} mb-2`}>
                      {language === 'en' ? 'Team Number' : 'Número da Equipe'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.teamNumber}
                      onChange={(e) => setFormData({ ...formData, teamNumber: e.target.value })}
                      className={`w-full px-4 py-3 ${inputBg} border ${inputBorder} rounded-lg ${textColor} focus:outline-none focus:border-red-500`}
                      placeholder="#12345"
                    />
                  </div>

                  <div>
                    <label className={`block ${textColor} mb-2`}>
                      {language === 'en' ? 'Team Name' : 'Nome da Equipe'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.teamName}
                      onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                      className={`w-full px-4 py-3 ${inputBg} border ${inputBorder} rounded-lg ${textColor} focus:outline-none focus:border-red-500`}
                      placeholder={language === 'en' ? 'Team Alphire' : 'Equipe Alphire'}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block ${textColor} mb-2`}>
                      {language === 'en' ? 'Robot Name' : 'Nome do Robô'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.robotName}
                      onChange={(e) => setFormData({ ...formData, robotName: e.target.value })}
                      className={`w-full px-4 py-3 ${inputBg} border ${inputBorder} rounded-lg ${textColor} focus:outline-none focus:border-red-500`}
                      placeholder="Nightfury"
                    />
                  </div>

                  <div>
                    <label className={`block ${textColor} mb-2`}>
                      {language === 'en' ? 'Season' : 'Temporada'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.season}
                      onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                      className={`w-full px-4 py-3 ${inputBg} border ${inputBorder} rounded-lg ${textColor} focus:outline-none focus:border-red-500`}
                      placeholder="2024-2025 INTO THE DEEP"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block ${textColor} mb-2`}>
                    {language === 'en' ? 'CAD Link' : 'Link do CAD'} *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.cadLink}
                    onChange={(e) => setFormData({ ...formData, cadLink: e.target.value })}
                    className={`w-full px-4 py-3 ${inputBg} border ${inputBorder} rounded-lg ${textColor} focus:outline-none focus:border-red-500`}
                    placeholder="https://drive.google.com/..."
                  />
                  <p className={`text-sm ${subtextColor} mt-2`}>
                    {language === 'en' 
                      ? 'Please share a link to your CAD files'
                      : 'Por favor, compartilhe um link para seus arquivos CAD'}
                  </p>
                </div>

                <div>
                  <label className={`block ${textColor} mb-2`}>
                    {language === 'en' ? 'Code Link' : 'Link do Código'}
                  </label>
                  <input
                    type="url"
                    value={formData.codeLink}
                    onChange={(e) => setFormData({ ...formData, codeLink: e.target.value })}
                    className={`w-full px-4 py-3 ${inputBg} border ${inputBorder} rounded-lg ${textColor} focus:outline-none focus:border-red-500`}
                    placeholder="https://github.com/..."
                  />
                  <p className={`text-sm ${subtextColor} mt-2`}>
                    {language === 'en' 
                      ? 'Optional: Share a link to your code repository'
                      : 'Opcional: Compartilhe um link para seu repositório de código'}
                  </p>
                </div>

                <div>
                  <label className={`block ${textColor} mb-2`}>
                    {language === 'en' ? 'Image Link' : 'Link da Imagem'} *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.imageLink}
                    onChange={(e) => setFormData({ ...formData, imageLink: e.target.value })}
                    className={`w-full px-4 py-3 ${inputBg} border ${inputBorder} rounded-lg ${textColor} focus:outline-none focus:border-red-500`}
                    placeholder="https://drive.google.com/..."
                  />
                  <p className={`text-sm ${subtextColor} mt-2`}>
                    {language === 'en' 
                      ? 'Please share a link to your robot images'
                      : 'Por favor, compartilhe um link para as imagens do seu robô'}
                  </p>
                </div>

                <div>
                  <label className={`block ${textColor} mb-2`}>
                    {language === 'en' ? 'Robot Description' : 'Descrição do Robô'} *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className={`w-full px-4 py-3 ${inputBg} border ${inputBorder} rounded-lg ${textColor} focus:outline-none focus:border-red-500`}
                    placeholder={language === 'en' 
                      ? 'Tell us about your robot: mechanisms, achievements, unique features...'
                      : 'Conte-nos sobre seu robô: mecanismos, conquistas, características únicas...'}
                  />
                </div>
              </>
            )}

            {/* Message Field (for general contact) */}
            {contactType === 'message' && (
              <div>
                <label className={`block ${textColor} mb-2`}>
                  {language === 'en' ? 'Your Message' : 'Sua Mensagem'} *
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={8}
                  className={`w-full px-4 py-3 ${inputBg} border ${inputBorder} rounded-lg ${textColor} focus:outline-none focus:border-red-500`}
                  placeholder={language === 'en' 
                    ? 'Write your message here...'
                    : 'Escreva sua mensagem aqui...'}
                />
              </div>
            )}

            {/* Success/Error Messages */}
            {submitted && (
              <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <Check className="text-green-500" size={20} />
                <span className="text-green-500">
                  {language === 'en' 
                    ? 'Message sent successfully! We\'ll get back to you soon.'
                    : 'Mensagem enviada com sucesso! Entraremos em contato em breve.'}
                </span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <span className="text-red-500">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full flex items-center justify-center gap-2 px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {submitting ? (
                language === 'en' ? 'Sending...' : 'Enviando...'
              ) : (
                <>
                  <Send size={20} />
                  {language === 'en' ? 'Send Message' : 'Enviar Mensagem'}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className={`${sectionBg} border ${borderColor} rounded-2xl p-8 text-center`}>
          <Mail className="text-red-500 mx-auto mb-4" size={32} />
          <h3 className={`${textColor} mb-2`}>
            {language === 'en' ? 'Email Contact' : 'Contato por Email'}
          </h3>
          <a 
            href="mailto:ftc.alphalumen@gmail.com" 
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            ftc.alphalumen@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}