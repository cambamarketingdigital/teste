import React, { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Calendar, Newspaper, Instagram, Users, Briefcase, Heart, MessageCircle, ExternalLink, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import InstagramEmbed from 'react-instagram-embed';

const Blog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'social' | 'birthdays'>('news');
  const [instagramPosts, setInstagramPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const instagramAccounts = [
    {
      username: 'cambamarketingdigital',
      url: 'https://www.instagram.com/cambamarketingdigital/',
      description: 'Perfil oficial da Camba Marketing Digital'
    },
    {
      username: 'danielvictorcamba01',
      url: 'https://www.instagram.com/danielvictorcamba01',
      description: 'Perfil do CEO Daniel Victor Camba'
    }
  ];

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      setIsLoading(true);
      try {
        // This would be replaced with actual Instagram API calls
        // For demo purposes, we're using mock data that mimics real posts
        const mockPosts = [
          {
            id: 'post1',
            permalink: 'https://www.instagram.com/p/abc123',
            caption: 'Transformando negócios através do marketing digital! 🚀 #MarketingDigital #Empreendedorismo',
            media_url: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
            username: 'cambamarketingdigital',
            timestamp: '2025-04-20T10:00:00Z'
          },
          {
            id: 'post2',
            permalink: 'https://www.instagram.com/p/def456',
            caption: 'Estratégias que fazem a diferença no seu negócio! 📈 #Marketing #Resultados',
            media_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
            username: 'cambamarketingdigital',
            timestamp: '2025-04-19T15:30:00Z'
          },
          {
            id: 'post3',
            permalink: 'https://www.instagram.com/p/ghi789',
            caption: 'Compartilhando conhecimento sobre marketing digital! 📱 #Educação #Marketing',
            media_url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
            username: 'danielvictorcamba01',
            timestamp: '2025-04-18T14:20:00Z'
          },
          {
            id: 'post4',
            permalink: 'https://www.instagram.com/p/jkl012',
            caption: 'Cases de sucesso que inspiram! 🏆 #Sucesso #Marketing',
            media_url: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg',
            username: 'danielvictorcamba01',
            timestamp: '2025-04-17T09:15:00Z'
          },
          {
            id: 'post5',
            permalink: 'https://www.instagram.com/p/mno345',
            caption: 'Inovação e tecnologia a serviço do seu negócio! 💡 #Inovação #Tecnologia',
            media_url: 'https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg',
            username: 'cambamarketingdigital',
            timestamp: '2025-04-16T16:45:00Z'
          },
          {
            id: 'post6',
            permalink: 'https://www.instagram.com/p/pqr678',
            caption: 'Construindo relacionamentos duradouros! 🤝 #Networking #Business',
            media_url: 'https://images.pexels.com/photos/3183190/pexels-photo-3183190.jpeg',
            username: 'danielvictorcamba01',
            timestamp: '2025-04-15T11:30:00Z'
          }
        ];

        setInstagramPosts(mockPosts);
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'social') {
      fetchInstagramPosts();
    }
  }, [activeTab]);

  // Mock data for business news
  const businessNews = [
    {
      id: 1,
      title: 'Como o Marketing Digital está Transformando Pequenos Negócios',
      source: 'Forbes Brasil',
      date: '2025-04-20',
      image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg',
      link: 'https://forbes.com.br'
    },
    {
      id: 2,
      title: 'Tendências de Marketing Digital para 2025',
      source: 'Exame',
      date: '2025-04-19',
      image: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg',
      link: 'https://exame.com'
    }
  ];

  // Mock data for birthdays
  const birthdays = [
    {
      id: 1,
      name: 'João Silva',
      role: 'Consultor',
      date: '2025-04-25',
      image: null,
      message: 'A Camba Marketing Digital deseja a você um feliz aniversário! Que seu dia seja repleto de alegria e conquistas. Agradecemos por fazer parte da nossa equipe! 🎉🎂'
    },
    {
      id: 2,
      name: 'Empresa A',
      type: 'client',
      date: '2025-04-27',
      image: null,
      message: 'A Camba Marketing Digital parabeniza a Empresa A pelo seu aniversário! É uma honra fazer parte da sua história de sucesso. Desejamos muitas conquistas e crescimento! 🎊🚀'
    }
  ];

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd 'de' MMMM", { locale: ptBR });
  };

  return (
    <div className="pb-6">
      <PageHeader 
        title="Blog"
        subtitle="Notícias, atualizações e conteúdo relevante para você"
      />
      
      <div className="px-4">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'news'
                ? 'bg-primary-500 text-secondary-900'
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }`}
            onClick={() => setActiveTab('news')}
          >
            <Newspaper size={20} className="mr-2" />
            Notícias
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'social'
                ? 'bg-primary-500 text-secondary-900'
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }`}
            onClick={() => setActiveTab('social')}
          >
            <Instagram size={20} className="mr-2" />
            Redes Sociais
          </button>
          <button
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'birthdays'
                ? 'bg-primary-500 text-secondary-900'
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }`}
            onClick={() => setActiveTab('birthdays')}
          >
            <Calendar size={20} className="mr-2" />
            Aniversários
          </button>
        </div>

        {/* News Content */}
        {activeTab === 'news' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessNews.map((news) => (
              <Card key={news.id} hoverable className="overflow-hidden">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-48 object-cover rounded-t-lg -mt-4 -mx-4 mb-4"
                />
                <div>
                  <Badge variant="secondary" size="sm">{news.source}</Badge>
                  <h3 className="text-lg font-semibold mt-2">{news.title}</h3>
                  <p className="text-sm text-secondary-500 mt-2">
                    {formatDate(news.date)}
                  </p>
                  <a
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-primary-600 hover:text-primary-700"
                  >
                    Ler mais →
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Social Media Content */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            {/* Instagram Accounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {instagramAccounts.map((account) => (
                <Card key={account.username} hoverable>
                  <a
                    href={account.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between hover:opacity-80 transition-opacity"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <Instagram size={24} className="text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">@{account.username}</p>
                        <p className="text-sm text-secondary-500">{account.description}</p>
                      </div>
                    </div>
                    <ExternalLink size={20} className="text-secondary-400" />
                  </a>
                </Card>
              ))}
            </div>

            {/* Instagram Posts */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader size={32} className="animate-spin text-primary-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instagramPosts.map((post) => (
                  <Card key={post.id} hoverable className="overflow-hidden">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Instagram size={20} className="text-primary-600" />
                      </div>
                      <div className="ml-3">
                        <a
                          href={`https://www.instagram.com/${post.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:text-primary-600 transition-colors"
                        >
                          @{post.username}
                        </a>
                        <p className="text-xs text-secondary-500">
                          {format(new Date(post.timestamp), "dd 'de' MMMM", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={post.media_url}
                        alt="Instagram post"
                        className="w-full aspect-square object-cover rounded-lg mb-4 hover:opacity-90 transition-opacity"
                      />
                    </a>
                    
                    <p className="text-secondary-800 text-sm line-clamp-3">
                      {post.caption}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-secondary-100">
                      <a
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                      >
                        Ver no Instagram
                        <ExternalLink size={16} className="ml-1" />
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Birthdays Content */}
        {activeTab === 'birthdays' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {birthdays.map((birthday) => (
              <Card key={birthday.id} hoverable>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    {birthday.type === 'client' ? (
                      <Briefcase size={24} className="text-primary-600" />
                    ) : (
                      <Users size={24} className="text-primary-600" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">{birthday.name}</h3>
                    <p className="text-sm text-secondary-500">
                      {birthday.type === 'client' ? 'Cliente' : birthday.role}
                    </p>
                    <p className="text-sm font-medium text-primary-600 mt-1">
                      {formatDate(birthday.date)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                  <p className="text-sm text-secondary-700 italic">
                    {birthday.message}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;