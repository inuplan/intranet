using Optional;
using System;
using System.Threading.Tasks;
using Optional.Unsafe;
using System.Net.Http;
using System.Net;
using System.Web.Http;

namespace Inuplan.WebAPI.Extensions.Workflows
{
    public static class Builders
    {
        public static TResult With<TSource, TResult>(this TSource source, Func<TSource, TResult> action)
            where TSource : class
        {
            if (source != default(TSource))
            {
                return action(source);
            }
            else
            {
                return default(TResult);
            }
        }

        public static async Task<TResult> WithAsync<TSource, TResult>(this Task<TSource> source, Func<TSource, Task<TResult>> action)
            where TSource : class
        {
            var work = await source;
            if(work != default(TSource))
            {
                var future = await action(work);
                return future;
            }

            return default(TResult);
        }

        public static TSource Do<TSource>(this TSource source, Action<TSource> action)
            where TSource : class
        {
            if (source != default(TSource))
            {
                action(source);
            }
            return source;
        }

        public static async Task<TSource> DoAsync<TSource>(this TSource source, Func<TSource, Task> future)
            where TSource : class
        {
            if (source != default(TSource))
            {
                await future(source);
            }
            return source;
        }

        public static Option<TResult> With<TSource, TResult>(this Option<TSource> option, Func<TSource, TResult> action)
            where TSource : class
        {
            if (option.HasValue)
            {
                var source = option.ValueOrFailure();
                return With(source, action).SomeNotNull();
            }
            else
            {
                return default(TResult).None();
            }
        }

        public static Option<bool> Some(this bool source)
        {
            return source.SomeWhen(b => b);
        }

        public static T ExtractValue<T>(this Option<T> option)
        {
            return option.ValueOr(default(T));
        }

        public static async Task<Option<TResult>> MapAsync<T, TResult>(this Option<T> source, Func<T, Task<TResult>> mapping)
            where T : class
        {
            if(source.HasValue)
            {
                var value = source.ValueOrFailure();
                return (await mapping(value)).SomeNotNull();
            }

            return Option.None<TResult>();
        }

        public static async Task<Option<TResult>> FlatMapAsync<T, TResult>(this Option<T> source, Func<T, Task<Option<TResult>>> mapping)
        {
            if(source.HasValue)
            {
                var value = source.ValueOrFailure();
                return await mapping(value);
            }

            return Option.None<TResult>();
        }

        public static TResult UnwrapTask<TResult>(this Task<TResult> source)
        {
            return source.Result;
        }

        public static Option<T1> Combine<T1, T2>(this Option<T1> source, Option<T2> other, Func<T1, T2, T1> combine)
        {
            if (!source.HasValue || !other.HasValue)
            {
                return Option.None<T1>();
            }

            return combine(source.ValueOrFailure(), other.ValueOrFailure()).Some();
        }

        public static HttpResponseMessage ReturnMessage<T>(this Option<T> source, Func<HttpStatusCode, HttpResponseMessage> create, HttpStatusCode success, HttpStatusCode failure)
        {
            return source.Match(t => create(success), () => create(failure));
        }

        public static T ReturnOrFailWith<T>(this Option<T> source, HttpStatusCode failure)
        {
            return source.Match(t => t, () => { throw new HttpResponseException(failure); });
        }

        public static T Log<T>(this T currentValue, string message)
            where T : class
        {
            if (currentValue != default(T))
                Console.WriteLine(currentValue + message);

            return currentValue;
        }
    }
}
