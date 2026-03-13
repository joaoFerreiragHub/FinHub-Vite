import { resolveContentViewMatch } from '@/lib/analytics'

describe('resolveContentViewMatch', () => {
  it('matches supported content detail routes', () => {
    expect(resolveContentViewMatch('/artigos/guia-etfs')).toEqual({
      contentType: 'article',
      slug: 'guia-etfs',
    })
    expect(resolveContentViewMatch('/videos/mercado-hoje')).toEqual({
      contentType: 'video',
      slug: 'mercado-hoje',
    })
    expect(resolveContentViewMatch('/cursos/investimento-base')).toEqual({
      contentType: 'course',
      slug: 'investimento-base',
    })
    expect(resolveContentViewMatch('/eventos/finhub-lisboa')).toEqual({
      contentType: 'event',
      slug: 'finhub-lisboa',
    })
    expect(resolveContentViewMatch('/podcasts/episodio-10')).toEqual({
      contentType: 'podcast',
      slug: 'episodio-10',
    })
    expect(resolveContentViewMatch('/livros/investidor-inteligente')).toEqual({
      contentType: 'book',
      slug: 'investidor-inteligente',
    })
    expect(resolveContentViewMatch('/criadores/joao-investe')).toEqual({
      contentType: 'creator',
      slug: 'joao-investe',
    })
    expect(resolveContentViewMatch('/recursos/corretora-x')).toEqual({
      contentType: 'resource',
      slug: 'corretora-x',
    })
  })

  it('normalizes trailing slash in detail routes', () => {
    expect(resolveContentViewMatch('/artigos/guia-etfs/')).toEqual({
      contentType: 'article',
      slug: 'guia-etfs',
    })
  })

  it('ignores listing or non-detail routes', () => {
    expect(resolveContentViewMatch('/artigos')).toBeNull()
    expect(resolveContentViewMatch('/explorar/tudo')).toBeNull()
    expect(resolveContentViewMatch('/dashboard')).toBeNull()
    expect(resolveContentViewMatch('/')).toBeNull()
    expect(resolveContentViewMatch('/recursos/corretoras')).toBeNull()
    expect(resolveContentViewMatch('/recursos/plataformas')).toBeNull()
    expect(resolveContentViewMatch('/recursos/comparar')).toBeNull()
  })
})
